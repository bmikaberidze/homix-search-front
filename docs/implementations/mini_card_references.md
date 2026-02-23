# Implementation: Mini Card References in Chat

This document outlines the implementation for adding property cards as references to user messages in the chat interface.

## User Experience

1. **Selecting a Property**: Click on any property card within the chat suggestions or search results. All areas of the card except the source label will add the card to the message references.
2. **Opening Source**: Click on the "Source" label (e.g., the website name like "myhome.ge") to open the original property listing in a new tab.
3. **Visual Feedback**: A mini version of the card (image, title, and "x" button) appears above the message input field.
4. **Removal**: Click the "x" on the mini card to remove it from the references.
5. **Sending**: When the user sends a message, the URLs of all referenced properties are sent to the API as `reference_urls`.
6. **Reset**: The referenced properties list is cleared after a message is sent.

## Technical Details

### State Management

In `ConversationPageNew.tsx`, we add a `referencedProperties` state:

```typescript
const [referencedProperties, setReferencedProperties] = useState<Property[]>([])
```

### Property Selection

The `PropertyCard` component is updated to support an `onSelect` callback. When in "chat mode" (`inChat={true}`), clicking the card triggers selection.

### Mini Card Component

A new `MiniPropertyCard` component is created in `src/app/components/ui/MiniPropertyCard.tsx`.

### API Integration

The `ChatApiPayload` in `src/app/api/chat.ts` is updated to include `reference_urls`.

```typescript
type ChatApiPayload = {
    session_id: string
    conversation_id: string
    message: string
    reference_urls?: string[]
}
```
