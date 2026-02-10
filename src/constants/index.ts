// for root level
export const BASE_PADDING = 12;
// additional padding for each level
export const LEVEL_PADDING = 12;

export const getItemPadding = (level: number, isFile: boolean) => {
  // files need extra padding to align with the folder icon
  const fileOffset = isFile ? 16 : 0;
  return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
};
