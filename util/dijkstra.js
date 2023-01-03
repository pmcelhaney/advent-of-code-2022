class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(newValue, newPriority) {
    const element = { value: newValue, priority: newPriority };

    const insertionIndex = this.queue.findIndex(
      ({ priority }) => newPriority < priority
    );

    if (insertionIndex === -1) {
      this.queue.push(element);

      return;
    }

    this.queue.splice(insertionIndex, 0, element);
  }

  dequeue() {
    return this.queue.shift().value;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  isNotEmpty() {
    return !this.isEmpty();
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function dijkstra(graph, start, end) {
  const unvisited = new PriorityQueue();
  const visited = new Set();

  const shortestPaths = { ...graph[start] };

  unvisited.enqueue(start, 0);

  while (unvisited.isNotEmpty()) {
    const current = unvisited.dequeue();

    if (current === end) {
      return shortestPaths[end];
    }

    if (visited.has(current)) {
      continue;
    }

    for (const [neighbor, distance] of Object.entries(graph[current])) {
      const candidate = shortestPaths[current] + distance;

      if (!(neighbor in shortestPaths) || candidate < shortestPaths[neighbor]) {
        shortestPaths[neighbor] = candidate;
      }

      unvisited.enqueue(neighbor, shortestPaths[neighbor]);
    }

    visited.add(current);
  }

  return Number.POSITIVE_INFINITY;
}
