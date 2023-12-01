import { createReader } from "./reader.js";

const reader = createReader("7.txt");

const rootPath = {
  name: "/",
  children: {},
  files: {},
  parent: null,
};

let path = rootPath;

function cd(dirname) {
  if (dirname === "..") {
    path = path.parent;

    return;
  }

  if (dirname === "/") {
    path = rootPath;

    return;
  }

  path = path.children[dirname];
}

function dir(dirname) {
  path.children[dirname] ??= {
    name: dirname,
    children: {},
    files: {},
    parent: path,
  };
}

let total = 0;

function file(name, size) {
  path.files[name] = {
    name,
    size: Number(size),
  };
  total += Number(size);
}

function readLine(line) {
  if (line.startsWith("$ cd")) {
    cd(line.slice(5));

    return;
  }

  if (line.startsWith("dir")) {
    dir(line.slice(4));

    return;
  }

  if (line.startsWith("$ ls")) {
    return;
  }

  const [size, name] = line.split(" ");

  file(name, size);
}

function sumSize(sum, f) {
  if (f.size === undefined) {
    throw new Error(`${f.name} has no size`);
  }

  return sum + f.size;
}

function calculateDirectorySizes(p) {
  Object.values(p.children).forEach(calculateDirectorySizes);

  p.size =
    Object.values(p.files).reduce(sumSize, 0) +
    Object.values(p.children).reduce(sumSize, 0);
}

function directorySizes(p) {
  return [p.size, ...Object.values(p.children).flatMap(directorySizes)];
}

function answer() {
  calculateDirectorySizes(rootPath);

  const spaceNeeded = 30_000_000 - (70_000_000 - rootPath.size);

  return directorySizes(rootPath)
    .sort((a, b) => b - a)
    .filter((s) => s >= spaceNeeded);
}

reader.on("line", readLine);

reader.on("close", () => {
  console.log(answer());
});
