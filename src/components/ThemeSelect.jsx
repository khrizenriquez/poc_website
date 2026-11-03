import { useTranslation } from 'react-i18next';
import { themeConfig } from '../config/theme';
import { useTheme } from '../theme/ThemeProvider';

export default function ThemeSelect() {
  const { t } = useTranslation();
  const { preference, changePreference } = useTheme();
  return (
    <select
      className="theme-select"
      aria-label={t('theme.label')}
      value={preference}
      onChange={(event) => changePreference(event.target.value)}
    >
      {themeConfig.preferences.map((value) => (
        <option key={value} value={value}>
          {t(`theme.${value}`)}
        </option>
      ))}
    </select>
  );
}
