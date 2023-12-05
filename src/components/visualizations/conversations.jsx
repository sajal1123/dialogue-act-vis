export const conversations = [
    {
      id: 1,
      snippet: 'Snippet 1: Caesar: Lorem ipsum dolor sit amet.',
      fullText: `
        Full conversation 1:
        ${Array(50).fill('Caesar: Lorem ipsum dolor sit amet.\n').join(' ')}
        ${Array(50).fill('Brutus: Consectetur adipiscing elit.\n').join(' ')}
      `,
    },
    {
      id: 2,
      snippet: 'Snippet 2: Mark Antony: Vivamus non ullamcorper nunc.',
      fullText: `
        Full conversation 2:
        ${Array(50).fill('Mark Antony: Vivamus non ullamcorper nunc.\n').join(' ')}
        ${Array(50).fill('Cleopatra: Nullam euismod lacinia nibh.\n').join(' ')}
      `,
    },
    {
      id: 3,
      snippet: 'Snippet 3: This is the third conversation snippet.',
      fullText: `
        Full conversation 3:
        Speaker A: How was your weekend?
        Speaker B: It was fantastic. I took a trip to the mountains.
        Speaker A: Sounds like a great escape. Tell me more about it.
      `,
    },
  ];
  