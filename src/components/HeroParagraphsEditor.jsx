import { Box } from '@mui/material'
import { AddItemButton, DeleteItemButton } from './PageEditorShell'
import { EditableText } from './Editable'

// Editor for the extra hero paragraphs an admin can append below a banner's
// subtitle. Mirrors the public PageBanner rendering so preview matches the site.
//
// `basePath` is the dot path of the paragraph array within the page content,
// e.g. "privacy.heroParagraphs" or "heroParagraphs".
export default function HeroParagraphsEditor({ paragraphs = [], basePath, editorMode, update, addItem, removeItem }) {
  const isEditing = editorMode === 'edit'

  return (
    <Box>
      {paragraphs.map((text, index) => (
        // Preview hides empty paragraphs exactly as the public banner does.
        (isEditing || text) && (
          <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 1, mt: 2, maxWidth: 620 }}>
            <Box sx={{ flex: 1 }}>
              <EditableText
                value={text}
                onChange={(value) => update(`${basePath}.${index}`, value)}
                editorMode={editorMode}
                multiline
                placeholder="Hero paragraph"
                sx={{ fontSize: { xs: 14.5, md: 16 }, fontWeight: 300, color: 'rgba(255,255,255,.78)' }}
              />
            </Box>
            {isEditing && (
              <DeleteItemButton
                onDelete={() => removeItem(basePath, index)}
                sx={{ position: 'static', boxShadow: 0, bgcolor: 'rgba(255,255,255,.92)' }}
              />
            )}
          </Box>
        )
      ))}

      {isEditing && (
        <Box sx={{ mt: 2 }}>
          <AddItemButton
            label="Add paragraph"
            sx={{ py: .5, fontSize: 12 }}
            onClick={() => addItem(basePath, '')}
          />
        </Box>
      )}
    </Box>
  )
}
