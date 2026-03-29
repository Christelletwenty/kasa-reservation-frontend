import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
      <AppFooter />
    </div>
  );
}
