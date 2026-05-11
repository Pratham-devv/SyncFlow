import { Moon, Sun, User, Bell, Shield, Palette, Globe, CreditCard, Construction } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ComingSoonCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-6 relative overflow-hidden group hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200">
    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
      <Construction size={12} />
      Coming Soon
    </div>
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-hover shrink-0">
        <Icon size={22} className="text-slate-400 dark:text-slate-500" />
      </div>
      <div className="min-w-0 pt-0.5">
        <h3
          className="font-bold text-slate-900 dark:text-white text-base mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const COMING_SOON_SECTIONS = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Update your name, avatar, bio and other personal information.',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure email, push, and in-app notification preferences.',
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Manage password, two-factor authentication, and active sessions.',
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Set your preferred language, timezone, and date format.',
    },
    {
      icon: CreditCard,
      title: 'Billing & Plans',
      description: 'View subscription details, upgrade plans, and manage invoices.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
          >
            Settings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Manage your workspace preferences and account settings.
          </p>
        </div>

        {/* Appearance — working section */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-6 mb-6 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 shrink-0">
              <Palette size={22} className="text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-slate-900 dark:text-white text-base mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Appearance
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                Choose between light and dark mode for your workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Light */}
                <button
                  onClick={() => isDark && toggleTheme()}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    !isDark
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-hover'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${!isDark ? 'bg-brand-100 dark:bg-brand-500/20' : 'bg-slate-100 dark:bg-dark-hover'}`}>
                    <Sun size={20} className={!isDark ? 'text-brand-600' : 'text-slate-400 dark:text-slate-500'} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold ${!isDark ? 'text-brand-700 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      Light
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">Clean & bright</div>
                  </div>
                  {!isDark && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>

                {/* Dark */}
                <button
                  onClick={() => !isDark && toggleTheme()}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-dark-hover'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-brand-100 dark:bg-brand-500/20' : 'bg-slate-100 dark:bg-dark-hover'}`}>
                    <Moon size={20} className={isDark ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold ${isDark ? 'text-brand-700 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      Dark
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">Easy on the eyes</div>
                  </div>
                  {isDark && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account info */}
        {user && (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-xl shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon grid */}
        <h3
          className="font-bold text-slate-800 dark:text-slate-200 text-base mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          More Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {COMING_SOON_SECTIONS.map((section) => (
            <ComingSoonCard key={section.title} {...section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
