const ParseAbstract = (abstract) => {
  let parsedAbstract = [];
  for (const [word, positions] of Object.entries(abstract)) {
    for (const pos of positions) {
      parsedAbstract[pos] = word;
    }
  }
  return parsedAbstract.join(" ");
};

export default ParseAbstract;
