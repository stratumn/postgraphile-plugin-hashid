/* istanbul ignore file */
// copied from https://tinyurl.com/y7nau3c6
// If PR is accepted, I'll ask benjie to export this function or parse tags for computed fields

export const parseTags = (str: string): any =>
  str.split(`\n`).reduce(
    (prev: any, curr: string) => {
      if (prev.text !== '') {
        return Object.assign({}, prev, {
          text: `${prev.text}\n${curr}`
        });
      }
      const match = curr.match(/^@[a-zA-Z][a-zA-Z0-9_]*($|\s)/);
      if (!match) {
        return Object.assign({}, prev, {
          text: curr
        });
      }
      const key = match[0].substr(1).trim();
      const value = match[0] === curr ? true : curr.replace(match[0], '');
      return Object.assign({}, prev, {
        tags: Object.assign({}, prev.tags, {
          [key]: !prev.tags.hasOwnProperty(key)
            ? value
            : Array.isArray(prev.tags[key])
              ? [...prev.tags[key], value]
              : [prev.tags[key], value]
        })
      });
    },
    {
      tags: {},
      text: ''
    }
  );
