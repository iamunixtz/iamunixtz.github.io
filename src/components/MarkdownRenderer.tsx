import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import 'prismjs/themes/prism-tomorrow.css';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-8 mb-4" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
        p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside my-4 space-y-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-4 space-y-2" {...props} />,
        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-primary hover:text-primary-hover underline" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-primary pl-4 my-4 italic" {...props} />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
          ) : (
            <code className="block bg-muted p-4 rounded-lg my-4 text-sm font-mono overflow-x-auto" {...props} />
          ),
        pre: ({ node, ...props }) => (
          <pre className="bg-muted p-4 rounded-lg my-4 overflow-x-auto" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
