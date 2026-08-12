import { Box, Container, Divider } from '@mui/material'
import PageEditorShell, { AddItemButton, DeleteItemButton } from '../components/PageEditorShell'
import { EditableText } from '../components/Editable'
import BlockEditor from '../components/BlockEditor'
import HeroParagraphsEditor from '../components/HeroParagraphsEditor'
import { SITEMAP_PAGE_ID, sitemapContentData, normalizeSitemapContent, saveSitemapContent } from '../shared/content/sitemapContent'
import { newBullets } from '../shared/content/blocks'

// Editable banner matching the public PageBanner styling.
function EditableBanner({ content, editorMode, update, addItem, removeItem }) {
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
          value={content.eyebrow}
          onChange={(value) => update('eyebrow', value)}
          editorMode={editorMode}
          placeholder="Eyebrow"
          sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: '#a8ffa8', mb: 1.5 }}
        />
        <EditableText
          value={content.title}
          onChange={(value) => update('title', value)}
          editorMode={editorMode}
          placeholder="Page title"
          variant="h2"
          sx={{ color: '#fff', fontSize: { xs: 32, md: 48 }, fontWeight: 800 }}
        />
        <Box sx={{ maxWidth: 620, mt: 2 }}>
          <EditableText
            value={content.subtitle}
            onChange={(value) => update('subtitle', value)}
            editorMode={editorMode}
            multiline
            placeholder="Subtitle"
            sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.85)' }}
          />
        </Box>
        <HeroParagraphsEditor
          paragraphs={content.heroParagraphs}
          basePath="heroParagraphs"
          editorMode={editorMode}
          update={update}
          addItem={addItem}
          removeItem={removeItem}
        />
      </Container>
    </Box>
  )
}

function SitemapEditor({ content, editorMode, update, addItem, removeItem }) {
  return (
    <Box>
      <EditableBanner content={content} editorMode={editorMode} update={update} addItem={addItem} removeItem={removeItem} />
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container maxWidth="md">
          {/* Single document card with divider-separated sections, matching the
              legal pages. */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'brand.line', borderRadius: 3, p: { xs: 3, sm: 5, md: 7 } }}>
            <Box sx={{ mb: 4 }}>
              <EditableText
                value={content.intro}
                onChange={(value) => update('intro', value)}
                editorMode={editorMode}
                multiline
                placeholder="Intro paragraph"
                sx={{ color: 'text.secondary', fontSize: 15.5, lineHeight: 1.9 }}
              />
            </Box>
            {content.groups.map((group, gi) => (
              <Box component="section" key={gi} sx={{ position: 'relative' }}>
                {gi > 0 && <Divider sx={{ my: { xs: 3.5, md: 4.5 }, borderColor: 'brand.line' }} />}
                {editorMode === 'edit' && (
                  <DeleteItemButton onDelete={() => removeItem('groups', gi)} sx={{ top: gi > 0 ? 24 : 0, left: 'auto', right: 0 }} />
                )}
                <Box sx={{ mb: 1.5, pr: editorMode === 'edit' ? 5 : 0 }}>
                  <EditableText
                    value={group.title}
                    onChange={(value) => update(`groups.${gi}.title`, value)}
                    editorMode={editorMode}
                    placeholder="Group title"
                    component="h2"
                    sx={{ color: 'primary.dark', fontSize: { xs: 20, md: 23 }, fontWeight: 700 }}
                  />
                </Box>
                {/* Plain text, not links — the legal pages' body treatment. */}
                <BlockEditor
                  blocks={group.blocks}
                  basePath={`groups.${gi}.blocks`}
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
                  label="Add group"
                  onClick={() => addItem('groups', { title: 'New Group', blocks: [newBullets()] })}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

// Sitemap page editor. Navbar/Footer come from the shared admin Layout; the
// editor toolbar and content plumbing come from PageEditorShell.
export default function SitemapPage() {
  return (
    <PageEditorShell
      pageId={SITEMAP_PAGE_ID}
      title="Sitemap Page"
      defaults={sitemapContentData}
      saveContent={saveSitemapContent}
      normalize={normalizeSitemapContent}
    >
      {(editor) => <SitemapEditor {...editor} />}
    </PageEditorShell>
  )
}
