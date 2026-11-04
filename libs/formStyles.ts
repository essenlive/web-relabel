// Shared Tailwind class sets for the public add-forms (form on the left, live label preview on the right).

const textBlock = "w-auto px-6 py-2 first:pt-6 last:pb-6";

export const formStyles = {
  form:
    "flex flex-row items-start max-lg:flex-col [&>*]:w-1/2 max-lg:[&>*]:w-full " +
    "max-sm:border-4 max-sm:border-primary max-sm:[&>*]:border-0 max-sm:[&>*:not(:last-child)]:border-b-4 max-sm:[&>*:not(:last-child)]:border-primary",
  values:
    "relative flex flex-col border-4 border-primary bg-white [&>div]:p-4 " +
    "[&_h2]:border-b-4 [&_h2]:border-primary [&_h2]:p-4 " +
    "[&_h3]:border-t-4 [&_h3]:border-primary [&_h3]:p-4 [&_h3]:text-primary",
  sending: "absolute inset-0 z-5 flex flex-col justify-end bg-primary [&_h2]:text-primary",
  submit: "border-t-4 border-primary bg-primary p-4 font-semibold text-white uppercase hover:bg-white hover:text-primary",
  alert: "mb-4 font-bold text-red-700",

  visualisation:
    "sticky top-[170px] grid grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)] grid-rows-[auto_auto] self-start border-4 border-l-0 border-primary " +
    "[grid-template-areas:'label_verso'_'explainer_explainer'] " +
    "max-lg:border-l-4 max-lg:border-t-0 " +
    "max-sm:static max-sm:grid-cols-[auto] max-sm:grid-rows-[auto_auto_auto] max-sm:[grid-template-areas:'label'_'verso'_'explainer'] " +
    "max-sm:[&>*:not(:last-child)]:min-h-40 max-sm:[&>*:not(:last-child)]:border-0 max-sm:[&>*:not(:last-child)]:border-t-4 max-sm:[&>*:first-child]:border-t-0",
  label: "[grid-area:label] border-r-4 border-primary bg-white",
  verso: "[grid-area:verso] bg-white",
  explainer: "[grid-area:explainer] border-t-4 border-primary bg-white p-4 [&>*]:mb-2",
  legends: "list-none",
  legend: "mr-2 inline-block size-4 rounded-full",

  illustration: "block max-h-2/5 w-full overflow-hidden border-b-4 border-primary object-cover",
  name: `${textBlock} text-primary uppercase`,
  description: textBlock,
  link: "px-6 py-2 first:pt-6 last:pb-6",
  tags: "px-6 py-2",
} as const;
