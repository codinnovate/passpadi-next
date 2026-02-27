export function useRephraseTextMutation() {
  const rephraseText = async (_args: { text: string; tone: string }) => {
    return { unwrap: async () => ({ text: _args.text }) };
  };
  return [rephraseText, { isLoading: false }] as const;
}
