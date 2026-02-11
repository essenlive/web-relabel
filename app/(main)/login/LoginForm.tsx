'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@components/Layout';
import { createClient } from '@libs/supabase/client';
import styles from '@styles/pages/Form.module.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    };

    return (
        <Layout padded>
            <div className={styles.form}>
                <form className={styles.values} onSubmit={handleSubmit}>
                    <h2>Connexion</h2>
                    {error && <div style={{ color: 'var(--color-rose-500)', marginBottom: '1rem' }}>{error}</div>}
                    <div>
                        <span className={styles.field__prefix}>Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@re-label.eu"
                            required
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                        />
                    </div>
                    <div>
                        <span className={styles.field__prefix}>Mot de passe</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                        />
                    </div>
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </Layout>
    );
}
