import { useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";

interface MDXRendererProps {
  mdxModule: any;
}

export default function MDXRenderer({ mdxModule }: MDXRendererProps) {
  const Content = useMemo(() => mdxModule.default, [mdxModule]);

  const components = {
    h1: (props: any) => (
      <h1
        className="text-4xl font-bold text-geo-primary dark:text-geo-darkprimary mb-4"
        {...props}
      />
    ),
    h2: (props: any) => (
      <h2
        className="text-2xl font-bold text-geo-primary dark:text-geo-darkprimary mb-3 mt-6"
        {...props}
      />
    ),
    p: (props: any) => (
      <p
        className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
        {...props}
      />
    ),
    a: (props: any) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:underline"
        {...props}
      />
    ),
    code: (props: any) => (
      <code
        className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono"
        {...props}
      />
    ),
    pre: (props: any) => (
      <pre
        className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto mb-4"
        {...props}
      />
    ),
    ul: (props: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
    ),
    ol: (props: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
    ),
  };

  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  );
}
