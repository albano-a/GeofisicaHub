interface ReferencesProps {
  references: string[];
}

export default function References({ references }: ReferencesProps) {
  if (references.length === 0) {
    return null; // Don't show anything if no references
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        References
      </h2>
      <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        {references.map((ref, index) => (
          <li key={index} className="pl-2">
            {ref}
          </li>
        ))}
      </ol>
    </div>
  );
}
