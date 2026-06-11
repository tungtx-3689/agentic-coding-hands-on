interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="max-w-[1512px] mx-auto px-36 max-md:px-6">{children}</div>
  );
}
