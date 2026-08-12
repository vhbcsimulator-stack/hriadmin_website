import { Box, Stack } from '@mui/material'
import { AddItemButton, DeleteItemButton } from './PageEditorShell'
import { EditableText } from './Editable'
import { BULLETS, newBullets, newParagraph } from '../shared/content/blocks'

// Editor for a section body — a mixed list of paragraph and bullet-list blocks.
// Mirrors the public ContentBlocks renderer so preview mode matches the site.
//
// `basePath` is the dot path of the blocks array within the page content, e.g.
// "privacy.sections.2.blocks" or "groups.0.blocks".
export default function BlockEditor({ blocks, basePath, editorMode, update, addItem, removeItem }) {
  const isEditing = editorMode === 'edit'
  const bodySx = { color: 'text.secondary', fontSize: 15.5, lineHeight: 1.9 }

  return (
    <Box>
      {(blocks || []).map((block, bi) => (
        <Box key={bi} sx={{ position: 'relative', mt: bi > 0 ? 2 : 0, pr: isEditing ? 5 : 0 }}>
          {isEditing && (
            <DeleteItemButton
              onDelete={() => removeItem(basePath, bi)}
              sx={{ top: 0, left: 'auto', right: 0 }}
            />
          )}

          {block.type === BULLETS ? (
            <Box component="ul" sx={{ pl: 3, my: 0, listStyleType: 'disc' }}>
              {(block.items || []).map((item, ii) => (
                <Box component="li" key={ii} sx={{ '&::marker': { color: 'primary.main' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <EditableText
                        value={item}
                        onChange={(value) => update(`${basePath}.${bi}.items.${ii}`, value)}
                        editorMode={editorMode}
                        placeholder="Bullet point"
                        sx={bodySx}
                      />
                    </Box>
                    {isEditing && (
                      <DeleteItemButton
                        onDelete={() => removeItem(`${basePath}.${bi}.items`, ii)}
                        sx={{ position: 'static', boxShadow: 0 }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
              {isEditing && (
                <Box component="li" sx={{ listStyle: 'none', mt: 1 }}>
                  <AddItemButton
                    label="Add bullet"
                    sx={{ py: .5, fontSize: 12 }}
                    onClick={() => addItem(`${basePath}.${bi}.items`, 'New point')}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <EditableText
              value={block.text}
              onChange={(value) => update(`${basePath}.${bi}.text`, value)}
              editorMode={editorMode}
              multiline
              placeholder="Paragraph text"
              sx={bodySx}
            />
          )}
        </Box>
      ))}

      {isEditing && (
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
          <AddItemButton
            label="Add paragraph"
            sx={{ py: .5, fontSize: 12 }}
            onClick={() => addItem(basePath, newParagraph())}
          />
          <AddItemButton
            label="Add bullet list"
            sx={{ py: .5, fontSize: 12 }}
            onClick={() => addItem(basePath, newBullets())}
          />
        </Stack>
      )}
    </Box>
  )
}
