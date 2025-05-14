
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './lib/supabase.ts'

// Check if Supabase is configured
if (!supabase) {
  const rootElement = document.getElementById("root")!;
  rootElement.innerHTML = `
    <div style="font-family: system-ui; margin: 50px auto; max-width: 600px; text-align: center;">
      <h1 style="color: #ff5555;">Supabase Configuration Error</h1>
      <p>This application requires Supabase environment variables to be set.</p>
      <h2>How to fix this:</h2>
      <ol style="text-align: left; line-height: 1.6;">
        <li>Make sure you've connected to Supabase via the Lovable integration.</li>
        <li>Go to your Supabase project dashboard.</li>
        <li>Navigate to Project Settings → API.</li>
        <li>Copy the "Project URL" and "anon/public" key.</li>
        <li>Go to your Lovable project settings → Secrets.</li>
        <li>Add two secrets:
          <ul>
            <li>VITE_SUPABASE_URL: Your Supabase project URL</li>
            <li>VITE_SUPABASE_ANON_KEY: Your Supabase anon/public key</li>
          </ul>
        </li>
        <li>Refresh this page after saving the secrets.</li>
      </ol>
    </div>
  `;
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
