interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const formattedTitle = id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="flex-1 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formattedTitle}
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Service details, pricing, and booking information.
        </p>
      </div>
    </main>
  );
}
