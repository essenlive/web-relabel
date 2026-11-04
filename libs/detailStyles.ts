// Shared Tailwind class sets for the structure / community / project detail pages.
// Desktop uses a named-area grid; below `md` the banner collapses to a stacked column.
// NOTE: keep every class string literal — Tailwind can't see classes built at runtime.

const stackedMobile =
  "max-md:flex max-md:flex-col max-md:[&>div]:border-4 max-md:[&>div]:border-primary max-md:[&>div:not(:last-child)]:border-b-0";

const listBox = "flex flex-col border-4 border-t-0 border-primary bg-white";
const listTitle = "border-b-4 border-primary p-4 text-[1.8rem] font-extrabold uppercase text-primary [&_span]:text-primary";
const list = "max-h-[350px] overflow-y-auto p-4";
const listItem = "text-base font-bold text-primary";

export const detail = {
  structureBanner:
    "relative grid grid-cols-[320px_1fr_1fr_1fr] grid-rows-[100px_350px_auto_auto_auto_auto] [grid-template-areas:'._carousel_carousel_carousel'_'label_carousel_carousel_carousel'_'label_title_title_title'_'explainer_description_description_description'_'share_productions_productions_productions'_'._productions_productions_productions'] " + stackedMobile,
  communityBanner:
    "relative grid grid-cols-[320px_1fr_1fr_1fr] grid-rows-[320px_auto_auto_auto_auto] [grid-template-areas:'illu_title_title_title'_'label_description_description_description'_'label_structures_structures_structures'_'explainer_structures_structures_structures'_'share_map_map_map'_'._map_map_map'] " + stackedMobile,
  projectBanner:
    "relative grid grid-cols-[350px_1fr_1fr_1fr] grid-rows-[75px_275px_auto_auto_auto_auto_auto] [grid-template-areas:'._carousel_carousel_carousel'_'label_carousel_carousel_carousel'_'label_title_title_title'_'explainer_description_description_description'_'share_detail_detail_detail'_'._detail_detail_detail'_'._map_map_map'] " + stackedMobile,

  carousel: "[grid-area:carousel] flex flex-col overflow-hidden border-4 border-primary bg-white",
  title:
    "[grid-area:title] flex items-center justify-between border-4 border-t-0 border-primary bg-primary p-4 " +
    "[&_h1]:w-3/5 [&_h1]:text-white [&_h1]:uppercase " +
    "[&_h2]:w-2/5 [&_h2]:text-right [&_h2]:text-xl [&_h2]:leading-[1.1em] [&_h2]:font-light [&_h2]:text-white [&_h2]:capitalize [&_h2_span:not(:first-child)]:ml-2",
  description: "[grid-area:description] flex w-full flex-col border-4 border-t-0 border-primary bg-white p-4 [&>p:not(:last-child)]:mb-4",

  productions: `[grid-area:productions] ${listBox}`,
  productionsTitle: listTitle,
  productionsList: list,
  productionsListName: listItem,
  productionsListProject: listItem,
  structures: `[grid-area:structures] ${listBox}`,
  structuresTitle: listTitle,
  structuresList: list,
  structuresListProject: listItem,

  detail:
    "[grid-area:detail] flex flex-col border-x-4 border-primary bg-white " +
    "[&>div]:border-b-4 [&>div]:border-primary [&>div]:p-4 [&>div>*]:pb-1 [&_b]:mt-2 [&_b]:mb-1 [&_b]:block [&_a]:mr-2 [&_a]:leading-[1.2]",
  sponsor: "-mx-4 -mb-4 flex w-[calc(100%+2rem)] flex-row items-center justify-start border-t-4 border-primary p-8 [&_img]:mr-8 [&_img]:h-16",
  map: "[grid-area:map] h-[400px] border-4 border-t-0 border-primary bg-white",

  label:
    "[grid-area:label] [&>*:first-child]:h-full [&>*:first-child]:border-4 [&>*:first-child]:border-r-0 [&>*:first-child]:border-primary " +
    "max-md:[&>*:first-child]:max-w-full max-md:[&>*:first-child]:border-0",
  explainer: "[grid-area:explainer] border-b-4 border-l-4 border-primary bg-white p-4 [&>*:not(:last-child)]:mb-2",
  legend: "mr-2 inline-block size-4 rounded-full",
  node: "mr-2 inline-block size-4 rounded-full border-4 border-[#e1e1e1]",

  share: "[grid-area:share] border-b-4 border-l-4 border-primary bg-white p-4",
  sharing: "mt-4 flex flex-row [&>*:not(:first-child)]:ml-2",
  embed:
    "mt-4 flex flex-col rounded-[16px] bg-[antiquewhite] " +
    "[&_button]:flex [&_button]:w-full [&_button]:cursor-pointer [&_button]:flex-row [&_button]:items-center [&_button]:p-2 [&_button]:text-black " +
    "[&_svg]:mr-2 [&_svg]:size-[20px] " +
    "[&_textarea]:h-28 [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-b-[16px] [&_textarea]:bg-white/50 [&_textarea]:p-2 [&_textarea]:font-mono [&_textarea]:text-xs [&_textarea]:leading-normal",
  print: "button mt-4 w-full text-center max-md:hidden",
} as const;
