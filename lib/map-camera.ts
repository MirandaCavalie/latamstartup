export type MapCamera = { x: number; y: number; scale: number };
export type MapBounds = [[number, number], [number, number]];

// Normalized Mercator coordinates, not program-office locations.
export function fitMapCamera(bounds: MapBounds, width: number, height: number, selected = false): MapCamera {
  const mobile = width < 760;
  const left = mobile ? 24 : 80;
  const top = selected ? (mobile ? 85 : 100) : 65;
  const right = selected && !mobile ? 410 : left;
  const bottom = selected && mobile ? Math.min(height * .44, 325) + 124 : 85;
  const usableWidth = Math.max(160, width - left - right);
  const usableHeight = Math.max(120, height - top - bottom);
  const dx = Math.max(.12, bounds[1][0] - bounds[0][0]);
  const dy = Math.max(.12, bounds[1][1] - bounds[0][1]);
  const scale = Math.min(2400, usableWidth / dx, usableHeight / dy);
  return {
    scale,
    x: left + usableWidth / 2 - (bounds[0][0] + bounds[1][0]) / 2 * scale,
    y: top + usableHeight / 2 - (bounds[0][1] + bounds[1][1]) / 2 * scale,
  };
}

export function zoomMapAt(camera: MapCamera, factor: number, point: [number, number]): MapCamera {
  const scale = Math.max(70, Math.min(3200, camera.scale * factor));
  const ratio = scale / camera.scale;
  return { scale, x: point[0] - (point[0] - camera.x) * ratio, y: point[1] - (point[1] - camera.y) * ratio };
}
