import { useEffect } from "react";

type MetaProps = {
  title?: string;
  description: string;
};

export function Meta({ title, description }: MetaProps) {
  useEffect(() => {
    document.title = "PoshakHeaven";

    const descriptionTag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (descriptionTag) {
      descriptionTag.content = description;
    }
  }, [description]);

  return null;
}
