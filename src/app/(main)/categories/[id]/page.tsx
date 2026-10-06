interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const formattedCategory = id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <main className="flex-1 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formattedCategory} Services
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Explore top-rated professionals and offerings for {formattedCategory.toLowerCase()}.
        </p>
      </div>
    </main>
  );
}
