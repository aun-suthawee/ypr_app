import { Suspense } from 'react';
import { PageLoading } from './ui/loading';

interface PageWrapperProps {
  children: React.ReactNode;
  loadingText?: string;
}

export function PageWrapper({ children, loadingText = "กำลังโหลดหน้า..." }: PageWrapperProps) {
  return (
    <Suspense fallback={<PageLoading text={loadingText} />}>
      {children}
    </Suspense>
  );
}

export default PageWrapper;
