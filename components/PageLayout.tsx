export default function PageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 py-8 space-y-8">
      <h1 className="font-bold lg:text-5xl text-4xl">{title}</h1>
      {children}
    </main>
  );
}
