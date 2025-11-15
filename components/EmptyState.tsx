export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      {description ? <p className="text-sm text-gray-600 mt-2">{description}</p> : null}
    </div>
  );
}


