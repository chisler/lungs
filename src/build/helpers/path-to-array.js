export function pathToArray(pathString) {
  if (!pathString) {
    return [];
  }

  let str;
  //Strange errors may exists
  if (!pathString) {
    console.warn("Strange pathString behaviour.")
    return [];
  } 

  if (pathString.slice(0, 8) === "instance") {
    str = pathString.slice(8).trim();
    str = str.startsWith('.') ? str.slice(1) : str
  } else {
    str = pathString.trim();
  }

  //in case of key with space: instance["key with spaces"]
  if (!str || str.includes('[')) {
    return []
  }

  return (
    str
      .split(".")
      .map(item => {
        // array[index] -> ['array', 'index']
        if (item.includes("[")) {
          return (/^(\w+)\s*((?:\[\s*\d+\s*\]\s*)*)$/.exec(item) || [null])
            .slice(1)
            .reduce((fun, args) => [fun].concat(args.match(/\d+/g)));
        } else {
          return item;
        }
      })
      //flatten
      .reduce(function(a, b) {
        return a.concat(b);
      }, [])
  );
}
