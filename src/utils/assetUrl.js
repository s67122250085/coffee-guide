const ASSET_VERSION = 'coffee-assets-2';

export default function assetUrl(path) {
  return `${path}?v=${ASSET_VERSION}`;
}
