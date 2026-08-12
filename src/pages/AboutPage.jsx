import { Box, Container, Typography, Stack, Button } from '@mui/material'
import PageEditorShell, { AddItemButton, DeleteItemButton } from '../components/PageEditorShell'
import { EditableText, ImageEditButton, IconPicker } from '../components/Editable'
import MaterialSymbol from '../../../shared/content/MaterialSymbol'
import { ABOUT_PAGE_ID, aboutContentData, saveAboutContent } from '../../../shared/content/aboutContent'

// Brand accent: interlocking blue/green rings used above section titles.
function BrandCircles({ size = 52 }) {
  return (
    <Box component="svg" width={size} height={size * 0.66} viewBox="0 0 52 34" sx={{ display: 'block', overflow: 'visible' }}>
      <circle cx="10" cy="17" r="11" fill="#0000FF" stroke="#0000FF" strokeWidth="5" />
      <circle cx="40" cy="17" r="11" fill="#0000FF" stroke="#0000FF" strokeWidth="5" />
      <circle cx="26" cy="17" r="11" fill="none" stroke="#006600" strokeWidth="5" />
    </Box>
  )
}

// Hero with the framed portrait image.
function Hero({ content, editorMode, update }) {
  const { hero } = content
  return (
    <Box component="section" sx={{ pt: { xs: 13, md: 17 }, pb: { xs: 7, md: 11 }, position: 'relative', overflow: 'hidden' }}>
      <Box aria-hidden sx={{ position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,102,0,.08), transparent 70%)', display: { xs: 'none', md: 'block' } }} />
      <Container sx={{ position: 'relative' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
          <Box>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 34, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#0000FF,#006600)' }} />
              <EditableText
                value={hero.eyebrow}
                onChange={(value) => update('hero.eyebrow', value)}
                editorMode={editorMode}
                placeholder="Eyebrow"
                component="span"
                sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: 'primary.main' }}
              />
            </Stack>
            <Box sx={{ mb: 3 }}>
              <EditableText
                value={hero.titleLead}
                onChange={(value) => update('hero.titleLead', value)}
                editorMode={editorMode}
                placeholder="Headline"
                variant="h2"
                sx={{ color: 'primary.dark', fontSize: { xs: 34, md: 48 }, textTransform: 'none', lineHeight: 1.1 }}
              />
              <EditableText
                value={hero.titleHighlight}
                onChange={(value) => update('hero.titleHighlight', value)}
                editorMode={editorMode}
                placeholder="Highlighted headline"
                variant="h2"
                sx={{ color: 'primary.main', fontSize: { xs: 34, md: 48 }, textTransform: 'none', lineHeight: 1.1 }}
              />
            </Box>
            <EditableText
              value={hero.para1}
              onChange={(value) => update('hero.para1', value)}
              editorMode={editorMode}
              multiline
              placeholder="First paragraph"
              sx={{ color: 'text.secondary', fontSize: 16, mb: 2.5 }}
            />
            <EditableText
              value={hero.para2}
              onChange={(value) => update('hero.para2', value)}
              editorMode={editorMode}
              multiline
              placeholder="Second paragraph"
              sx={{ color: 'text.secondary', fontSize: 16, mb: 4 }}
            />

            <Stack direction="row" spacing={1.75} sx={{ flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
              <Button variant="contained" color="primary" size="large" disableRipple>
                <EditableText
                  value={hero.primaryCta}
                  onChange={(value) => update('hero.primaryCta', value)}
                  editorMode={editorMode}
                  placeholder="Primary button"
                  component="span"
                  sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}
                />
              </Button>
              <Button variant="outlined" color="primary" size="large" disableRipple>
                <EditableText
                  value={hero.secondaryCta}
                  onChange={(value) => update('hero.secondaryCta', value)}
                  editorMode={editorMode}
                  placeholder="Secondary button"
                  component="span"
                  sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}
                />
              </Button>
            </Stack>
          </Box>

          {/* Framed image */}
          <Box sx={{ position: 'relative', px: { xs: 0, md: 2 }, py: { xs: 0, md: 2 } }}>
            <Box aria-hidden sx={{
              position: 'absolute', top: 0, right: 0, bottom: 0, left: { xs: 0, md: 24 },
              border: '2px solid', borderColor: 'primary.main', borderRadius: 2, opacity: .35,
              display: { xs: 'none', md: 'block' },
            }} />
            <Box sx={{
              position: 'relative', height: { xs: 300, md: 420 }, borderRadius: 2, overflow: 'hidden',
              '&:hover .heroImageButton': { opacity: 1 },
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                backgroundImage: `url(${hero.image})`,
                backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform .7s ease, filter .35s ease, opacity .35s ease',
              },
              '&:hover::before': { transform: 'scale(1.06)', filter: 'saturate(1.05) brightness(.9)', opacity: .9 },
            }}>
              <ImageEditButton
                value={hero.image}
                onChange={(url) => update('hero.image', url)}
                editorMode={editorMode}
                label="Edit image"
                className="heroImageButton"
                sx={{ opacity: 0 }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// Centered heading with the overlapping-circles brand accent.
function SectionTitle({ children, icon }) {
  return (
    <Stack sx={{ mb: 5, width: '100%', alignItems: 'center', textAlign: 'center' }}>
      {icon && <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center', width: '100%' }}>{icon}</Box>}
      <Box sx={{ color: 'primary.main', fontSize: { xs: 30, md: 40 }, textTransform: 'uppercase' }}>
        {children}
      </Box>
    </Stack>
  )
}

// The brand's core values, as an editable icon/title/copy grid.
function CoreValues({ content, editorMode, update, addItem, removeItem }) {
  const { coreValues } = content
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
      <Container>
        <Stack sx={{ mb: 5, alignItems: 'center', textAlign: 'center' }}>
          <EditableText
            value={coreValues.title}
            onChange={(value) => update('coreValues.title', value)}
            editorMode={editorMode}
            placeholder="Section title"
            variant="h2"
            sx={{ color: 'primary.main', fontSize: { xs: 30, md: 40 }, textTransform: 'uppercase' }}
          />
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2.5 }}>
          {coreValues.items.map((v, index) => (
            <Box key={index} sx={{
              position: 'relative',
              bgcolor: 'rgba(0,0,255,0.035)',
              borderRadius: 2, p: 3, textAlign: 'center', cursor: 'default',
              transition: 'transform .28s ease, .28s ease, border-color .28s ease, background .28s ease',
              '&:hover': { transform: 'translateY(-6px)', bgcolor: '#fff', borderColor: 'secondary.main', },
              '&:hover .valueIcon': { transform: 'scale(1.12)' },
            }}>
              {editorMode === 'edit' && (
                <DeleteItemButton onDelete={() => removeItem('coreValues.items', index)} sx={{ top: 6, left: 'auto', right: 6 }} />
              )}
              <Box className="valueIcon" sx={{ color: 'secondary.main', mb: 2, transition: 'transform .28s ease' }}>
                <MaterialSymbol name={v.icon} sx={{ fontSize: 34 }} />
              </Box>
              <EditableText
                value={v.title}
                onChange={(value) => update(`coreValues.items.${index}.title`, value)}
                editorMode={editorMode}
                placeholder="Value title"
                sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '.4px', color: 'primary.dark', mb: 1.25 }}
              />
              <EditableText
                value={v.copy}
                onChange={(value) => update(`coreValues.items.${index}.copy`, value)}
                editorMode={editorMode}
                multiline
                placeholder="Value description"
                sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.55 }}
              />
              <IconPicker
                value={v.icon}
                onChange={(value) => update(`coreValues.items.${index}.icon`, value)}
                editorMode={editorMode}
              />
            </Box>
          ))}
        </Box>
        {editorMode === 'edit' && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <AddItemButton
              label="Add core value"
              onClick={() => addItem('coreValues.items', { icon: 'star', title: 'New Value', copy: 'Describe this value.' })}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

// Mission and Vision cards.
function MissionVision({ content, editorMode, update, addItem, removeItem }) {
  const { missionVision } = content
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 9 } }}>
      <Container>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 8 }, textAlign: 'center' }}>
          {missionVision.items.map((m, index) => (
            <Box key={index} sx={{
              position: 'relative',
              bgcolor: '#fff', borderRadius: 3, p: { xs: 4, md: 5 }, cursor: 'default',
              border: '1px solid', borderColor: 'brand.line',
              transition: 'transform .35s cubic-bezier(.2,.7,.2,1),  .35s ease, border-color .35s ease',
              '&:hover': { transform: 'translateY(-6px)', borderColor: 'rgba(0,102,0,.25)' },
              '&:hover .mvBadge': { bgcolor: 'primary.main', color: '#fff', },
              '&:hover .mvRule': { width: 56 },
            }}>
              {editorMode === 'edit' && (
                <DeleteItemButton onDelete={() => removeItem('missionVision.items', index)} sx={{ top: 10, left: 'auto', right: 10 }} />
              )}
              <Box className="mvBadge" sx={{
                width: 72, height: 72, mx: 'auto', mb: 2.5, borderRadius: '50%',
                bgcolor: 'rgba(0,102,0,.08)', color: 'primary.main',
                display: 'grid', placeItems: 'center',
                transition: 'background-color .35s ease, color .35s ease,  .35s ease',
              }}>
                <MaterialSymbol name={m.icon} sx={{ fontSize: 36 }} />
              </Box>
              <EditableText
                value={m.title}
                onChange={(value) => update(`missionVision.items.${index}.title`, value)}
                editorMode={editorMode}
                placeholder="Title"
                variant="h2"
                sx={{ color: 'primary.main', fontSize: { xs: 26, md: 32 }, mb: 1.5 }}
              />
              <Box className="mvRule" sx={{ height: 3, width: 32, borderRadius: 2, bgcolor: 'primary.main', mx: 'auto', mb: 2.5, transition: 'width .35s ease' }} />
              <EditableText
                value={m.copy}
                onChange={(value) => update(`missionVision.items.${index}.copy`, value)}
                editorMode={editorMode}
                multiline
                placeholder="Description"
                sx={{ color: 'text.secondary', fontSize: 16, maxWidth: 460, mx: 'auto', mb: 2.5 }}
              />
              <EditableText
                value={m.tags}
                onChange={(value) => update(`missionVision.items.${index}.tags`, value)}
                editorMode={editorMode}
                placeholder="Tag line"
                sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '.5px', fontSize: 14.5 }}
              />
              <IconPicker
                value={m.icon}
                onChange={(value) => update(`missionVision.items.${index}.icon`, value)}
                editorMode={editorMode}
              />
            </Box>
          ))}
        </Box>
        {editorMode === 'edit' && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <AddItemButton
              label="Add card"
              onClick={() => addItem('missionVision.items', { icon: 'star', title: 'New Card', copy: 'Describe this.', tags: 'Tag / Tag / Tag' })}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

// "What We Do" — an editable grid of service photos with labels.
function WhatWeDo({ content, editorMode, update, addItem, removeItem }) {
  const { whatWeDo } = content
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'brand.surface' }}>
      <Container>
        <SectionTitle icon={<BrandCircles size={56} />}>
          <EditableText
            value={whatWeDo.title}
            onChange={(value) => update('whatWeDo.title', value)}
            editorMode={editorMode}
            placeholder="Section title"
            component="span"
            sx={{ fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', color: 'inherit' }}
          />
        </SectionTitle>
        <Box sx={{ maxWidth: 780, mx: 'auto', mb: 6 }}>
          <EditableText
            value={whatWeDo.description}
            onChange={(value) => update('whatWeDo.description', value)}
            editorMode={editorMode}
            multiline
            placeholder="Section description"
            sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 15.5 }}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2.5 }}>
          {whatWeDo.items.map((item, index) => (
            <Box key={index} sx={{
              height: { xs: 150, md: 350 }, borderRadius: 1.5, overflow: 'hidden', position: 'relative',
              boxShadow: '0 12px 28px -14px rgba(0, 0, 0, 0.4)',
              backgroundColor: '#0c3d0c',
              '&:hover .whatWeDoImageButton': { opacity: 1 },
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform .5s ease, filter .35s ease, opacity .35s ease',
              },
              '&::after': {
                content: '""', position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(3,16,18,.55) 0%, rgba(3,16,18,.35) 45%, rgba(3,16,18,.62) 100%)',
                transition: 'background .35s ease, opacity .35s ease',
              },
              '&:hover::before': {
                transform: 'scale(1.06)',
                filter: 'saturate(1.05) brightness(.88)',
                opacity: .9,
              },
              '&:hover::after': {
                background: 'linear-gradient(180deg, rgba(3,16,18,.32) 0%, rgba(3,16,18,.22) 45%, rgba(3,16,18,.78) 100%)',
              },
            }}>
              <ImageEditButton
                value={item.image}
                onChange={(url) => update(`whatWeDo.items.${index}.image`, url)}
                editorMode={editorMode}
                label="Edit image"
                className="whatWeDoImageButton"
                sx={{ top: '50%', right: 'auto', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }}
              />
              {editorMode === 'edit' && (
                <DeleteItemButton onDelete={() => removeItem('whatWeDo.items', index)} sx={{ top: 'auto', left: 170, bottom: 12 }} />
              )}
              <Box sx={{ position: 'absolute', zIndex: 2, top: 12, left: 10, right: 10 }}>
                <EditableText
                  value={item.label}
                  onChange={(value) => update(`whatWeDo.items.${index}.label`, value)}
                  editorMode={editorMode}
                  placeholder="Label"
                  sx={{
                    color: '#fff', textAlign: 'center', textTransform: 'uppercase',
                    fontSize: { xs: 12, md: 14 }, fontWeight: 800, lineHeight: 1,
                    textShadow: '0 2px 6px rgba(0,0,0,.65)',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
        {editorMode === 'edit' && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <AddItemButton
              label="Add service"
              onClick={() => addItem('whatWeDo.items', {
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
                label: 'New Service',
              })}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

// Numbered "Why Choose Us" steps.
function WhyChoose({ content, editorMode, update, addItem, removeItem }) {
  const { whyChoose } = content
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12, bgcolor: 'brand.line' } }}>
      <Container>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'center', mb: { xs: 4, md: 6 } }}>
          <EditableText
            value={whyChoose.title}
            onChange={(value) => update('whyChoose.title', value)}
            editorMode={editorMode}
            placeholder="Section title"
            variant="h2"
            sx={{ color: 'primary.main', fontSize: { xs: 30, md: 42 } }}
          />
          <EditableText
            value={whyChoose.description}
            onChange={(value) => update('whyChoose.description', value)}
            editorMode={editorMode}
            multiline
            placeholder="Section description"
            sx={{ color: 'text.secondary', fontSize: 16.5 }}
          />
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box aria-hidden sx={{
            display: { xs: 'none', md: 'block' }, position: 'absolute', top: 18, left: '7%', right: '7%',
            height: 2, bgcolor: 'brand.line', zIndex: 0,
          }} />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(7, 1fr)' }, gap: { xs: 4, md: 2 } }}>
            {whyChoose.items.map((w, index) => (
              <Box key={index} sx={{
                position: 'relative', textAlign: 'center', px: .5, cursor: 'default',
                pt: editorMode === 'edit' ? 3 : 0,
                '&:hover .stepCircle': { transform: 'scale(1.15)'},
                '&:hover .stepTitle': { color: 'secondary.main' },
                // The number's edit panel renders inside .stepCircle, and a
                // transform makes that circle a stacking context — which traps
                // the panel's z-index there, so the title and copy below paint
                // over it. Drop the zoom while the panel is open (a mounted
                // TextField is the tell) and lift the whole step above its grid
                // siblings, so a neighbouring step can't cover it either.
                '&:has(.MuiInputBase-root) .stepCircle': { transform: 'none' },
                '&:has(.MuiInputBase-root)': { zIndex: 5 },
              }}>
                {editorMode === 'edit' && (
                  <DeleteItemButton onDelete={() => removeItem('whyChoose.items', index)} sx={{ top: 0, left: '50%', ml: 2.5 }} />
                )}
                <Box className="stepCircle" sx={{
                  width: 38, height: 38, borderRadius: '50%', bgcolor: 'secondary.main', color: '#fff',
                  display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, mx: 'auto', mb: 2,
                  transition: 'transform .25s ease, background .25s ease, .25s ease',
                }}>
                  <EditableText
                    value={w.n}
                    onChange={(value) => update(`whyChoose.items.${index}.n`, value)}
                    editorMode={editorMode}
                    placeholder="00"
                    component="span"
                    sx={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
                  />
                </Box>
                <EditableText
                  value={w.title}
                  onChange={(value) => update(`whyChoose.items.${index}.title`, value)}
                  editorMode={editorMode}
                  placeholder="Step title"
                  className="stepTitle"
                  sx={{ fontWeight: 600, fontSize: 14, color: 'primary.dark', mb: 1, transition: 'color .25s ease' }}
                />
                <EditableText
                  value={w.copy}
                  onChange={(value) => update(`whyChoose.items.${index}.copy`, value)}
                  editorMode={editorMode}
                  multiline
                  placeholder="Step description"
                  sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.5 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        {editorMode === 'edit' && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <AddItemButton
              label="Add step"
              onClick={() => addItem('whyChoose.items', { n: '00', title: 'New Step', copy: 'Describe this step.' })}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

// Closing call-to-action band.
function CallToAction({ content, editorMode, update }) {
  const { cta } = content
  return (
    <Box component="section" sx={{
      position: 'relative', py: { xs: 9, md: 11 }, textAlign: 'center', color: '#fff', overflow: 'hidden',
      background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)',
    }}>
      <Container sx={{ maxWidth: 760 }}>
        <EditableText
          value={cta.title}
          onChange={(value) => update('cta.title', value)}
          editorMode={editorMode}
          multiline
          placeholder="CTA title"
          variant="h2"
          sx={{ color: '#fff', textTransform: 'none', fontSize: { xs: 24, md: 34 }, fontWeight: 700, mb: 2 }}
        />
        <EditableText
          value={cta.text}
          onChange={(value) => update('cta.text', value)}
          editorMode={editorMode}
          multiline
          placeholder="CTA text"
          sx={{ color: 'rgba(255,255,255,.85)', fontSize: 15.5, fontWeight: 300, maxWidth: 620, mx: 'auto', mb: 4 }}
        />
        <Button
          variant="outlined" size="large" disableRipple
          sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.7)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }}
        >
          <EditableText
            value={cta.button}
            onChange={(value) => update('cta.button', value)}
            editorMode={editorMode}
            placeholder="Button label"
            component="span"
            sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}
          />
        </Button>
      </Container>
    </Box>
  )
}

// About page editor. Navbar/Footer come from the shared admin Layout; the
// editor toolbar and content plumbing come from PageEditorShell.
export default function AboutPage() {
  return (
    <PageEditorShell
      pageId={ABOUT_PAGE_ID}
      title="About Page"
      defaults={aboutContentData}
      saveContent={saveAboutContent}
    >
      {(editor) => (
        <Box>
          <Hero {...editor} />
          <CoreValues {...editor} />
          <MissionVision {...editor} />
          <WhatWeDo {...editor} />
          <WhyChoose {...editor} />
          <CallToAction {...editor} />
        </Box>
      )}
    </PageEditorShell>
  )
}
