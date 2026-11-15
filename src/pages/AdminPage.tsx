import React, { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { parseAndValidate, type ValidationResult } from '../lib/adminTools';
import { ALL_LESSONS } from '../features/lessons/lessonService';
import { LessonPage } from './LessonPage';

type Row = { id: string; published: boolean; sort_order: number; data: any };

const PROGRESS_KEYS = [
  'dental_bloom_completed_lessons',
  'dental_bloom_review_state',
  'dental_bloom_activity_days',
];

const btn = 'px-3 py-2 rounded-xl text-sm border border-[#F0E4E9] bg-white';
const btnMain = 'px-3 py-2 rounded-xl text-sm bg-[#D985A8] text-white font-medium';

export const AdminPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);

  const [rows, setRows] = useState<Row[]>([]);
  const [text, setText] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(false);

  const snapshot = useRef<Record<string, string | null>>({});
  const previewInfo = useRef<{ id: string; previous: any | null } | null>(null);

  const loadRows = async () => {
    const { data } = await supabase
      .from('lessons')
      .select('id, published, sort_order, data')
      .order('sort_order', { ascending: true });
    setRows((data as Row[]) || []);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadRows();
    else setRows([]);
  }, [session]);

  const login = async () => {
    setBusy(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) setLoginError('Не удалось войти. Проверь почту и пароль.');
    setBusy(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const check = () => {
    setMessage('');
    setResult(parseAndValidate(text));
  };

  const save = async (publish: boolean) => {
    if (!result?.ok) return;
    const lesson = result.lesson;
    setBusy(true);
    setMessage('');
    const existing = rows.find((r) => r.id === lesson.id);
    const sort = existing
      ? existing.sort_order
      : rows.length
      ? Math.max(...rows.map((r) => r.sort_order)) + 10
      : 100;
    const { error } = await supabase.from('lessons').upsert({
      id: lesson.id,
      data: lesson,
      published: publish,
      sort_order: sort,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      setMessage('Ошибка сохранения: ' + error.message);
    } else {
      setMessage(publish ? 'Опубликовано ✅' : 'Сохранено как черновик ✅');
      await loadRows();
    }
    setBusy(false);
  };

  const setPublished = async (id: string, value: boolean) => {
    const { error } = await supabase
      .from('lessons')
      .update({ published: value, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) setMessage('Ошибка: ' + error.message);
    await loadRows();
  };

  const remove = async (id: string) => {
    if (!window.confirm('Удалить урок ' + id + ' из базы?')) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) setMessage('Ошибка: ' + error.message);
    await loadRows();
  };

  const edit = (row: Row) => {
    setText(JSON.stringify(row.data, null, 2));
    setResult(null);
    setMessage('Урок загружен в поле. Измени и нажми «Проверить».');
    window.scrollTo(0, 0);
  };

  const startPreview = () => {
    if (!result?.ok) return;
    const lesson = result.lesson;
    const list = ALL_LESSONS as any[];
    const i = list.findIndex((x) => x.id === lesson.id);
    previewInfo.current = { id: lesson.id, previous: i >= 0 ? list[i] : null };
    if (i >= 0) list[i] = lesson;
    else list.push(lesson);
    snapshot.current = {};
    PROGRESS_KEYS.forEach((k) => {
      snapshot.current[k] = localStorage.getItem(k);
    });
    setPreview(true);
  };

  const stopPreview = () => {
    const info = previewInfo.current;
    const list = ALL_LESSONS as any[];
    if (info) {
      const i = list.findIndex((x) => x.id === info.id);
      if (i >= 0) {
        if (info.previous) list[i] = info.previous;
        else list.splice(i, 1);
      }
    }
    PROGRESS_KEYS.forEach((k) => {
      const v = snapshot.current[k];
      if (v === null || v === undefined) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    });
    window.dispatchEvent(new Event('lessonProgressUpdated'));
    previewInfo.current = null;
    setPreview(false);
  };

    const backToApp = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const wrapper = 'max-w-md mx-auto p-4 min-h-screen bg-[#FFF9F6] text-[#34313A]';

  if (checking) return <div className={wrapper}>Загрузка…</div>;

  if (!session) {
    return (
      <div className={wrapper}>
                <button onClick={backToApp} className="text-[#817782] text-sm font-medium mb-3">
          ← В приложение
        </button>
        <h1 className="text-2xl font-bold mb-4">Админ-вход</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="space-y-3"
        >
          <input
            type="email"
            autoComplete="username"
            placeholder="Почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#F0E4E9] bg-white"
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#F0E4E9] bg-white"
          />
          {loginError && <p className="text-sm text-red-700">{loginError}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#D985A8] text-white font-medium py-3 rounded-2xl"
          >
            {busy ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    );
  }

  if (preview && result?.ok) {
    return <LessonPage lessonId={result.lesson.id} onBack={stopPreview} />;
  }

  return (
    <div className={wrapper}>
            <button onClick={backToApp} className="text-[#817782] text-sm font-medium mb-3">
        ← В приложение
      </button>
      <h1 className="text-2xl font-bold mb-1">Админ-кабинет</h1>
      <p className="text-sm text-[#817782] mb-4">Вы вошли: {session.user.email}</p>

      <div className="bg-white p-4 rounded-2xl border border-[#F0E4E9] mb-4 space-y-3">
        <h2 className="font-semibold">Новый урок</h2>
        <p className="text-xs text-[#817782]">Вставь готовый урок (JSON) целиком.</p>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          rows={10}
          placeholder="Вставь JSON урока сюда"
          className="w-full p-3 rounded-xl border border-[#F0E4E9] text-sm font-mono"
        />
        <div className="flex gap-2">
          <button onClick={check} className={btnMain}>
            Проверить
          </button>
          <button
            onClick={() => {
              setText('');
              setResult(null);
              setMessage('');
            }}
            className={btn}
          >
            Очистить
          </button>
        </div>

        {result && !result.ok && (
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {result.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}

        {result?.ok && (
          <div className="space-y-2">
            <p className="text-sm text-green-800">✅ Формат правильный: {result.lesson.title}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={startPreview} className={btn}>
                Предпросмотр
              </button>
              <button onClick={() => save(false)} disabled={busy} className={btn}>
                Сохранить черновик
              </button>
              <button onClick={() => save(true)} disabled={busy} className={btnMain}>
                Опубликовать
              </button>
            </div>
          </div>
        )}

        {message && <p className="text-sm">{message}</p>}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#F0E4E9] mb-4">
        <h2 className="font-semibold mb-2">Уроки в базе: {rows.length}</h2>
        {rows.length === 0 && <p className="text-sm text-[#817782]">Пока пусто.</p>}
        {rows.map((r) => (
          <div key={r.id} className="border-t border-[#F0E4E9] pt-2 mt-2">
            <p className="text-sm font-medium">{r.data?.title || r.id}</p>
            <p className="text-xs text-[#817782] mb-2">
              {r.id} — {r.published ? 'опубликован' : 'черновик'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => edit(r)} className={btn}>
                Редактировать
              </button>
              <button onClick={() => setPublished(r.id, !r.published)} className={btn}>
                {r.published ? 'Снять' : 'Опубликовать'}
              </button>
              <button onClick={() => remove(r.id)} className={btn}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={logout} className="w-full bg-white border border-[#F0E4E9] py-3 rounded-2xl text-sm">
        Выйти
      </button>
    </div>
  );
};