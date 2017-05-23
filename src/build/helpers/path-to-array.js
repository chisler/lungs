export function pathToArray(pathString) {
  if (!pathString) {
    return [];
  }

  let str;
  if (pathString.slice(0, 9) === "instance.") {
    str = pathString.slice(9).trim();
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
