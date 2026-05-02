import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
