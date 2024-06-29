// Original Source: https://github.com/ShukantPal/pixi-spatial-hash/blob/master/src/SpatialHash.ts

import { Rectangle } from "./interface";

export type BoundGetter<Node> = (node: Node) => Rectangle;

type BucketHash = `${number}|${number}`;

export class SpatialHash<Node> {
  private buckets: Map<BucketHash, Set<Node>> = new Map();

  constructor(private cellSize: number, private boundGetter: BoundGetter<Node>) {
    this.reset();
  }

  set(node: Node): void {
    this.remove(node);

    this.hashBounds(this.boundGetter(node), hash => {
      let bucket = this.buckets.get(hash);

      if (!bucket) {
        bucket = new Set();
        this.buckets.set(hash, bucket);
      }

      bucket.add(node);
    });
  }

  remove(node: Node): void {
    this.buckets.forEach(bucket => bucket.delete(node));
  }

  search(bounds: Rectangle): Set<Node> {
    const searchResult = new Set<Node>();

    this.hashBounds(bounds, hash => {
      const bucket = this.buckets.get(hash);

      if (bucket) {
        bucket.forEach(node => {
          const objectBounds = this.boundGetter(node);
          const intersects =
            objectBounds.right >= bounds.left &&
            objectBounds.left <= bounds.right &&
            objectBounds.bottom >= bounds.top &&
            objectBounds.top <= bounds.bottom;

          if (intersects) {
            searchResult.add(node);
          }
        });
      }
    });

    return searchResult;
  }

  private reset(): void {
    this.buckets.forEach((value, key) => this.buckets.set(key, new Set()));
  }

  private getBucketHash(x: number, y: number): BucketHash {
    return `${Math.floor(x / this.cellSize)}|${Math.floor(y / this.cellSize)}`;
  }

  private hashBounds(bounds: Rectangle, callback: (hash: BucketHash) => void): void {
    const cellSize = this.cellSize;
    const sizeInv = 1 / cellSize;

    const minX = Math.floor(bounds.left * sizeInv) * cellSize;
    const minY = Math.floor(bounds.top * sizeInv) * cellSize;
    const maxX = Math.floor(bounds.right * sizeInv) * cellSize;
    const maxY = Math.floor(bounds.bottom * sizeInv) * cellSize;

    for (let y = maxY; y >= minY; y -= cellSize) {
      for (let x = maxX; x >= minX; x -= cellSize) {
        callback(this.getBucketHash(x, y));
      }
    }
  }
}
