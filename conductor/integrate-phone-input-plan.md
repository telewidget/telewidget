# Plan - Integrate react-international-phone

Integrate the `react-international-phone` library to provide a specialized phone number input for WhatsApp and Direct Call channels.

## Scope

- In: `EditorChannels.tsx`
- Out: No other files.

## Action Items

- [x] Install `react-international-phone` dependency.
- [ ] Import `PhoneInput` and its styles in `EditorChannels.tsx`.
- [ ] Replace WhatsApp phone number `Input` with `PhoneInput`.
- [ ] Replace Direct Call phone number `Input` with `PhoneInput`.
- [ ] Configure `PhoneInput` with proper default country or automatic detection if available.
- [ ] Apply custom styling to `PhoneInput` components to align with the Shadcn/UI theme.

## Validation

- [ ] Run the configurator.
- [ ] Open the "Channels" tab.
- [ ] Verify that WhatsApp and Direct Call phone inputs show flag dropdowns and format numbers correctly.
- [ ] Verify that changes are saved to the configuration state.
