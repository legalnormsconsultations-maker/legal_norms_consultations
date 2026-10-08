"use client";

import { useState } from "react";

type PageContent = {
  id: string;
  pageName: string;
  category?: string | null;
  subcategory?: string | null;
  bundle?: string | null;
  pagination?: string | null;
  title?: string | null;
  description?: string | null;
  richTextContent?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
  cardType?: string | null;
  cardWidth?: string | null;
  cardHeight?: string | null;
  mediaWidth?: string | null;
  mediaHeight?: string | null;
  imageUrl?: string | null; // legacy
  sortOrder: number;
};

function ContentCard({ content }: { content: PageContent }) {
  const url = content.mediaUrl || content.imageUrl;
  const cardType = content.cardType || "normal";

  let wrapperClass = "bg-card text-foreground rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition flex flex-col h-full";
  let colSpanClass = "";
  
  if (cardType !== "normal") {
    colSpanClass = "md:col-span-2 lg:col-span-4";
  }

  const customStyle: React.CSSProperties = {};
  if (content.cardWidth) {
    customStyle.width = content.cardWidth;
    customStyle.margin = "0 auto";
  }
  if (content.cardHeight) customStyle.height = content.cardHeight;

  const renderMedia = (className: string, defaultStyle?: React.CSSProperties) => {
    const finalStyle = { ...defaultStyle };
    if (content.mediaWidth) finalStyle.width = content.mediaWidth;
    if (content.mediaHeight) finalStyle.height = content.mediaHeight;

    // Use full height if custom mediaHeight is provided
    const mediaMaxHeight = content.mediaHeight || content.cardHeight ? '100%' : '16rem';

    return (
      <div className={`relative bg-muted overflow-hidden ${className}`} style={finalStyle}>
        {content.mediaType === "video" ? (
          <video src={url!} controls className="w-full h-full object-cover" style={{maxHeight: mediaMaxHeight}} />
        ) : content.mediaType === "audio" ? (
          <div className="flex items-center justify-center w-full h-full min-h-[100px] p-4 bg-muted">
            <audio src={url!} controls className="w-full" />
          </div>
        ) : content.mediaType === "pdf" ? (
          <iframe src={`${url}#toolbar=0`} className="w-full h-full border-0 min-h-[16rem]" style={{minHeight: mediaMaxHeight}} />
        ) : content.mediaType === "document" ? (
          <div className="flex items-center justify-center h-48 bg-muted">
            <a href={url!} target="_blank" rel="noreferrer" className="text-orange-600 font-bold hover:underline">
              Download Document
            </a>
          </div>
        ) : (
          <img src={url!} alt={content.title || "Media"} className="w-full h-full object-cover" style={{maxHeight: mediaMaxHeight}} />
        )}
      </div>
    );
  };

  const renderTexts = () => (
    <>
      {content.title && <h3 className="text-xl font-bold text-foreground mb-2">{content.title}</h3>}
      {content.description && <p className="text-muted-foreground leading-relaxed mb-4">{content.description}</p>}
      {content.richTextContent && (
        <div 
          className="prose prose-slate dark:prose-invert prose-sm max-w-none" 
          dangerouslySetInnerHTML={{ __html: content.richTextContent }} 
        />
      )}
    </>
  );

  if (cardType === "media-right") {
    return (
      <div className={colSpanClass} style={customStyle}>
        <div className={`${wrapperClass} p-6 block`}>
          {url && renderMedia("float-right ml-6 mb-4 rounded-lg", { width: '40%' })}
          <div className="w-full">
            {renderTexts()}
          </div>
          <div className="clear-both"></div>
        </div>
      </div>
    );
  }

  if (cardType === "media-left") {
    return (
      <div className={colSpanClass} style={customStyle}>
        <div className={`${wrapperClass} p-6 block`}>
          {url && renderMedia("float-left mr-6 mb-4 rounded-lg", { width: '40%' })}
          <div className="w-full">
            {renderTexts()}
          </div>
          <div className="clear-both"></div>
        </div>
      </div>
    );
  }

  if (cardType === "media-center") {
    return (
      <div className={colSpanClass} style={customStyle}>
        <div className={`${wrapperClass} p-6 flex flex-col items-center`}>
          {url && renderMedia("mb-6 mx-auto rounded-lg", { width: '60%' })}
          <div className="w-full text-left">
            {renderTexts()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={colSpanClass} style={customStyle}>
      <div className={wrapperClass}>
        {url && renderMedia("w-full min-h-[200px]")}
        <div className="p-6 flex-grow">
          {renderTexts()}
        </div>
      </div>
    </div>
  );
}

function CardGrid({ items, title, subtitle }: { items: PageContent[], title?: string, subtitle?: string }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 4;
  const isExpandable = items.length > limit;
  const displayItems = expanded ? items : items.slice(0, limit);

  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      {title && <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>}
      {subtitle && <h4 className="text-xl font-medium text-muted-foreground mb-6">{subtitle}</h4>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {displayItems.map(item => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>

      {isExpandable && (
        <div className="mt-8 text-center">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="px-6 py-2 border-2 border-orange-600 text-orange-600 font-bold rounded-full hover:bg-orange-600 hover:text-white transition"
          >
            {expanded ? "View Less" : "View All"}
          </button>
        </div>
      )}
    </div>
  );
}

type TreeNode = {
  items: PageContent[];
  children: Record<string, TreeNode>;
};

function buildTree(contents: PageContent[]) {
  const root: TreeNode = { items: [], children: {} };

  contents.forEach(content => {
    // Collect non-empty grouping fields in order
    const path = [
      content.category?.trim(),
      content.subcategory?.trim(),
      (content.bundle || content.pagination)?.trim()
    ].filter(Boolean) as string[];

    let current = root;
    for (const p of path) {
      if (!current.children[p]) {
        current.children[p] = { items: [], children: {} };
      }
      current = current.children[p];
    }
    current.items.push(content);
  });

  return root;
}

function TreeRenderer({ nodeName, nodeValue, depth }: { nodeName: string, nodeValue: TreeNode, depth: number }) {
  const isRoot = !nodeName;
  const nextDepth = isRoot ? 0 : depth + 1;

  return (
    <div className={isRoot ? "space-y-12 w-full my-12" : "space-y-6"}>
      {!isRoot && depth === 0 && (
        <div className="border-b-2 border-slate-200 pb-2 mb-6">
          <h2 className="text-4xl font-extrabold text-slate-900">{nodeName}</h2>
        </div>
      )}
      {!isRoot && depth === 1 && (
        <h3 className="text-2xl font-bold text-slate-800 mb-4">{nodeName}</h3>
      )}

      {/* Items at this exact path level. If depth >= 2, nodeName becomes the subtitle of the grid */}
      {nodeValue.items.length > 0 && (
        <CardGrid 
          items={nodeValue.items} 
          subtitle={!isRoot && depth >= 2 ? nodeName : undefined} 
        />
      )}

      {/* Render children */}
      {Object.entries(nodeValue.children).map(([childName, childNode]) => (
        <TreeRenderer 
          key={childName} 
          nodeName={childName} 
          nodeValue={childNode} 
          depth={nextDepth} 
        />
      ))}
    </div>
  );
}

export default function DynamicCardsClient({ contents }: { contents: PageContent[] }) {
  if (!contents || contents.length === 0) return null;

  const tree = buildTree(contents);

  return <TreeRenderer nodeName="" nodeValue={tree} depth={0} />;
}
