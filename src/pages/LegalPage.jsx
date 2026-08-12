import { Box, Container, Divider } from '@mui/material'
import PageEditorShell, { AddItemButton, DeleteItemButton } from '../components/PageEditorShell'
import { EditableText } from '../components/Editable'
import BlockEditor from '../components/BlockEditor'
import HeroParagraphsEditor from '../components/HeroParagraphsEditor'
import { LEGAL_PAGE_ID, legalContentData, normalizeLegalContent, saveLegalContent } from '../shared/content/legalContent'
import { newParagraph } from '../shared/content/blocks'

// Editable banner matching the public PageBanner styling.
function EditableBanner({ page, base, editorMode, update, addItem, removeItem }) {
  return (
    <Box sx={{ position: 'relative', color: '#fff', pt: { xs: 16, md: 20 }, pb: { xs: 7, md: 9 }, overflow: 'hidden' }}>
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, backgroundColor: '#032803' }} />
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(120% 100% at 80% 0%, rgba(0,0,255,.25), transparent 55%),' +
          'linear-gradient(160deg, rgba(3,40,3,.92) 0%, rgba(2,20,2,.82) 100%)',
      }} />
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <EditableText
          value={page.eyebrow}
          onChange={(value) => update(`${base}.eyebrow`, value)}
          editorMode={editorMode}
          placeholder="Eyebrow"
          sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: '#a8ffa8', mb: 1.5 }}
        />
        <EditableText
          value={page.title}
          onChange={(value) => update(`${base}.title`, value)}
          editorMode={editorMode}
          placeholder="Page title"
          variant="h2"
          sx={{ color: '#fff', fontSize: { xs: 32, md: 48 }, fontWeight: 800 }}
        />
        <Box sx={{ maxWidth: 620, mt: 2 }}>
          <EditableText
            value={page.subtitle}
            onChange={(value) => update(`${base}.subtitle`, value)}
            editorMode={editorMode}
            multiline
            placeholder="Subtitle"
            sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.85)' }}
          />
        </Box>
        <HeroParagraphsEditor
          paragraphs={page.heroParagraphs}
          basePath={`${base}.heroParagraphs`}
          editorMode={editorMode}
          update={update}
          addItem={addItem}
          removeItem={removeItem}
        />
      </Container>
    </Box>
  )
}

function LegalEditor({ page, type, editorMode, update, addItem, removeItem }) {
  const base = type
  return (
    <Box>
      <EditableBanner page={page} base={base} editorMode={editorMode} update={update} addItem={addItem} removeItem={removeItem} />
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'brand.line', borderRadius: 3, p: { xs: 3, sm: 5, md: 7 } }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 4 }}>
              <Box sx={{ color: 'text.secondary', fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.2px' }}>Last updated:</Box>
              <EditableText
                value={page.updated}
                onChange={(value) => update(`${base}.updated`, value)}
                editorMode={editorMode}
                placeholder="Date"
                sx={{ color: 'text.secondary', fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.2px' }}
              />
            </Box>
            {page.sections.map((section, index) => (
              <Box component="section" key={index} sx={{ position: 'relative' }}>
                {index > 0 && <Divider sx={{ my: { xs: 3.5, md: 4.5 }, borderColor: 'brand.line' }} />}
                {editorMode === 'edit' && (
                  <DeleteItemButton onDelete={() => removeItem(`${base}.sections`, index)} sx={{ top: index > 0 ? 24 : 0, left: 'auto', right: 0 }} />
                )}
                {/* The padding belongs on this wrapper, not on the heading's
                    own sx: EditableText positions its pencil against its
                    outermost box, so padding the inner Typography would leave
                    the pencil underneath the delete button. */}
                <Box sx={{ mb: 1.5, pr: editorMode === 'edit' ? 5 : 0 }}>
                  <EditableText
                    value={section.heading}
                    onChange={(value) => update(`${base}.sections.${index}.heading`, value)}
                    editorMode={editorMode}
                    placeholder="Section heading"
                    component="h2"
                    sx={{ color: 'primary.dark', fontSize: { xs: 20, md: 23 }, fontWeight: 700 }}
                  />
                </Box>
                <BlockEditor
                  blocks={section.blocks}
                  basePath={`${base}.sections.${index}.blocks`}
                  editorMode={editorMode}
                  update={update}
                  addItem={addItem}
                  removeItem={removeItem}
                />
              </Box>
            ))}
            {editorMode === 'edit' && (
              <Box sx={{ mt: 4 }}>
                <AddItemButton
                  label="Add section"
                  onClick={() => addItem(`${base}.sections`, { heading: 'New Section', blocks: [newParagraph()] })}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

// Legal page editor (Privacy / Terms / Cookies). All three routes share one
// content document keyed by `type`; this edits the branch for its type.
export default function LegalPage({ type }) {
  return (
    <PageEditorShell
      pageId={LEGAL_PAGE_ID}
      title="Legal Page"
      defaults={legalContentData}
      saveContent={saveLegalContent}
      normalize={normalizeLegalContent}
    >
      {({ content, editorMode, update, addItem, removeItem }) => (
        <LegalEditor
          page={content[type]}
          type={type}
          editorMode={editorMode}
          update={update}
          addItem={addItem}
          removeItem={removeItem}
        />
      )}
    </PageEditorShell>
  )
}
