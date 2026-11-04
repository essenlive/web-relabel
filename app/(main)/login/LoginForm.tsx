'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@components/Layout';
import { createClient } from '@libs/supabase/client';
import { formStyles } from '@libs/formStyles';

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
            setError(error.status === 400 ? 'Email ou mot de passe incorrect.' : 'Connexion impossible, veuillez réessayer.');
            setLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    };

    return (
        <Layout padded>
            <div className={formStyles.form}>
                <form className={formStyles.values} onSubmit={handleSubmit}>
                    <h2>Connexion</h2>
                    {error && <div role="alert" className="mb-4 text-rose-500">{error}</div>}
                    <div>
                        <span className="font-bold">Email</span>
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@essenlive.xyz"
                            required
                            className="mb-4 w-full p-2"
                        />
                    </div>
                    <div>
                        <span className="font-bold">Mot de passe</span>
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="mb-4 w-full p-2"
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
