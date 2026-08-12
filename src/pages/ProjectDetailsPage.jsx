import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stack, Button, TextField, Chip } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PageEditorShell, { AddItemButton, DeleteItemButton } from '../components/PageEditorShell'
import { EditableText, ImageEditButton, IconPicker } from '../components/Editable'
import MaterialSymbol from '../shared/content/MaterialSymbol'
import { PROJECTS_PAGE_ID, projectsContentData, saveProjectsContent } from '../shared/content/projectsContent'

// Underlined form field styled for the dark green enquiry section.
const whiteField = {
  '& .MuiInput-root': { color: '#fff', fontSize: 16 },
  '& .MuiInput-root:before': { borderBottomColor: 'rgba(255,255,255,.5)' },
  '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottomColor: '#fff' },
  '& .MuiInput-root:after': { borderBottomColor: '#fff' },
  '& label': { color: 'rgba(255,255,255,.85)' },
  '& label.Mui-focused': { color: '#fff' },
}

// Editor for a single project, addressed by ?slug=. It loads the whole projects
// document through PageEditorShell and edits the one entry whose slug matches,
// so Save persists the same list the admin table and public site read.
export default function ProjectDetailsPage() {
  const [params] = useSearchParams()
  const slug = params.get('slug')

  return (
    <PageEditorShell
      pageId={PROJECTS_PAGE_ID}
      title={`Project: ${slug || '—'}`}
      defaults={projectsContentData}
      saveContent={saveProjectsContent}
    >
      {(editor) => {
        const index = editor.content.projects.findIndex((p) => p.slug === slug)
        if (index < 0) return <ProjectNotFound slug={slug} />
        return <ProjectEditor editor={editor} index={index} />
      }}
    </PageEditorShell>
  )
}

function ProjectNotFound({ slug }) {
  const navigate = useNavigate()
  return (
    <Container sx={{ py: 20, textAlign: 'center' }}>
      <Typography variant="h2" sx={{ fontSize: 28, mb: 2 }}>Project not found</Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        No project with slug “{slug}”. It may have been deleted.
      </Typography>
      <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')}>
        Back to Projects
      </Button>
    </Container>
  )
}

function ProjectEditor({ editor, index }) {
  const { content, editorMode, update, addItem, removeItem } = editor
  const project = content.projects[index]
  const base = `projects.${index}`
  const isEditing = editorMode === 'edit'
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const onForm = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  // Same scroll parallax as the public project-details / homepage hero, but only
  // while previewing — during editing the content must stay put and unblurred so
  // the hero fields remain usable.
  useEffect(() => {
    const reset = () => {
      if (bgRef.current) bgRef.current.style.transform = ''
      if (contentRef.current) {
        contentRef.current.style.transform = ''
        contentRef.current.style.opacity = ''
        contentRef.current.style.filter = ''
      }
    }
    if (editorMode === 'edit' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reset()
      return undefined
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const p = Math.min(window.scrollY / window.innerHeight, 1)
        if (bgRef.current) bgRef.current.style.transform = `scale(${1 + p * 0.35}) translateY(${p * 50}px)`
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${p * -80}px)`
          contentRef.current.style.opacity = String(1 - p * 1.3)
          contentRef.current.style.filter = `blur(${p * 5}px)`
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [editorMode])

  return (
    <Box>
      {/* Listing settings — edit-only. These feed the admin table and the
          public /projects showcase, and aren't otherwise shown on this page. */}
      {editorMode === 'edit' && (
        <Container sx={{ pt: 3 }}>
          <Box sx={{ border: '1px dashed', borderColor: 'brand.line', borderRadius: 2, p: 2.5, bgcolor: 'brand.surface' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.5px', color: 'primary.dark', mb: 1.5 }}>
              Listing settings
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box sx={{ position: 'relative', width: 200, height: 130, borderRadius: 1.5, flexShrink: 0,
                backgroundImage: `url(${project.cover})`, backgroundSize: 'cover', backgroundPosition: 'center', bgcolor: '#fff',
                transition: 'transform .35s ease, box-shadow .35s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 18px 32px -18px rgba(0,0,0,.35)' },
                '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'linear-gradient(180deg, rgba(0,102,0,.08), rgba(0,0,0,.12))', opacity: 0, transition: 'opacity .35s ease' },
                '&:hover::after': { opacity: 1 },
                '&:hover .coverImageButton': { opacity: 1 },
              }}>
                <ImageEditButton value={project.cover} onChange={(url) => update(`${base}.cover`, url)} editorMode={editorMode} label="Cover" className="coverImageButton" sx={{ opacity: 0 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>URL slug (fixed)</Typography>
                <Box component="code" sx={{ fontSize: 14, fontFamily: 'monospace', color: 'primary.main' }}>/{project.slug}</Box>
                <Typography sx={{ mt: 1.5, fontSize: 12, color: 'text.secondary', mb: .25 }}>Listing summary</Typography>
                <EditableText value={project.summary} onChange={(v) => update(`${base}.summary`, v)} editorMode={editorMode} multiline placeholder="Short listing summary" sx={{ fontSize: 14 }} />
                <Stack direction="row" spacing={3} sx={{ mt: 1.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: .25 }}>Type</Typography>
                    <EditableText value={project.type} onChange={(v) => update(`${base}.type`, v)} editorMode={editorMode} placeholder="Residential" sx={{ fontSize: 14, fontWeight: 600 }} />
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Container>
      )}

      {/* Hero */}
      <Box sx={{ position: 'relative', color: '#fff', pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 10 }, textAlign: 'center', overflow: 'hidden' }}>
        {/* Image layer. Hovering it (anywhere but the copy, which sits above on
            its own z-index) reveals the edit control, darkens the photo and
            fades the copy back so the image reads as the thing being edited. */}
        <Box
          className="heroImageLayer"
          sx={{
            position: 'absolute', inset: 0, zIndex: 1,
            ...(isEditing && {
              '&:hover .heroImageMedia': { transform: 'scale(1.04)', filter: 'saturate(1.05) brightness(.88)', opacity: .88 },
              '&:hover .heroImageScrim': { opacity: 1 },
              '&:hover .heroImageControls': { opacity: 1 },
              '&:hover .heroImageButton': { opacity: 1 },
              '&:hover ~ .heroContent': { opacity: .35 },
            }),
          }}
        >
          <Box ref={bgRef} className="heroImageMedia" aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${project.hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#052905', transformOrigin: 'center 40%', willChange: 'transform', transition: 'transform .35s ease, filter .35s ease, opacity .35s ease' }} />
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,20,2,.6) 0%, rgba(2,20,2,.4) 50%, rgba(2,20,2,.72) 100%)' }} />
          <Box className="heroImageScrim" aria-hidden sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,.45)', opacity: 0, transition: 'opacity .35s ease' }} />
          <Box className="heroImageControls" sx={{ opacity: 0, transition: 'opacity .35s ease' }}>
            <ImageEditButton value={project.hero.image} onChange={(url) => update(`${base}.hero.image`, url)} editorMode={editorMode} label="Hero image" className="heroImageButton" sx={{ top: 24, right: 24, opacity: 0 }} />
          </Box>
        </Box>
        {/* pointerEvents: none so only the copy itself — not the empty gutters —
            counts as "over the words" for the image layer's hover. */}
        <Container ref={contentRef} className="heroContent" sx={{ position: 'relative', zIndex: 2, pointerEvents: 'none', willChange: 'transform, opacity, filter', transition: 'opacity .35s ease' }}>
          <Box sx={{ maxWidth: 720, mx: 'auto', pointerEvents: 'auto' }}>
            <Stack direction="row" spacing={1.25} sx={{ justifyContent: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.25 }}>
              <Chip label={
                <EditableText value={project.status} onChange={(v) => update(`${base}.status`, v)} editorMode={editorMode} placeholder="Status" component="span" sx={{ fontSize: 'inherit', color: 'inherit' }} />
              } size="small" sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 600 }} />
              <Chip icon={<PlaceOutlinedIcon sx={{ fontSize: 16, color: '#fff !important' }} />} label={
                <EditableText value={project.location} onChange={(v) => update(`${base}.location`, v)} editorMode={editorMode} placeholder="Location" component="span" sx={{ fontSize: 'inherit', color: 'inherit' }} />
              } size="small" sx={{ bgcolor: 'rgba(255,255,255,.16)', color: '#fff', fontWeight: 500, backdropFilter: 'blur(4px)' }} />
            </Stack>
            <EditableText value={project.title} onChange={(v) => update(`${base}.title`, v)} editorMode={editorMode} placeholder="Project title" variant="h1" sx={{ fontSize: { xs: 34, md: 60 }, fontWeight: 800, mb: 2 }} />
            <Box sx={{ maxWidth: 640, mx: 'auto', mb: 4 }}>
              <EditableText value={project.hero.subtitle} onChange={(v) => update(`${base}.hero.subtitle`, v)} editorMode={editorMode} multiline placeholder="Hero subtitle" sx={{ fontSize: { xs: 14.5, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.9)' }} />
            </Box>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
              <Button variant="contained" color="primary" size="large" disableRipple>
                <EditableText value={project.hero.primaryCta} onChange={(v) => update(`${base}.hero.primaryCta`, v)} editorMode={editorMode} placeholder="Primary button" component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }} />
              </Button>
              <Button variant="outlined" size="large" disableRipple sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }}>
                <EditableText value={project.hero.secondaryCta} onChange={(v) => update(`${base}.hero.secondaryCta`, v)} editorMode={editorMode} placeholder="Secondary button" component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }} />
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Intro — a place to call home */}
      <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 8 }, alignItems: 'center' }}>
            <Box>
              <EditableText value={project.intro.eyebrow} onChange={(v) => update(`${base}.intro.eyebrow`, v)} editorMode={editorMode} placeholder="Eyebrow" sx={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: 13, fontWeight: 600, color: 'primary.main', mb: 2 }} />
              <EditableText value={project.intro.description} onChange={(v) => update(`${base}.intro.description`, v)} editorMode={editorMode} multiline placeholder="Description" sx={{ color: 'text.secondary', fontSize: 16, mb: 3 }} />
              <Box sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 2, mb: 3.5 }}>
                <EditableText value={project.intro.quote} onChange={(v) => update(`${base}.intro.quote`, v)} editorMode={editorMode} multiline placeholder="Pull quote" sx={{ color: 'text.primary', fontStyle: 'italic' }} />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                {project.intro.details.map((d, i) => (
                  <Box key={i} sx={{ position: 'relative', p: 2, borderRadius: 2 }}>
                    {editorMode === 'edit' && project.intro.details.length > 1 && (
                      <DeleteItemButton onDelete={() => removeItem(`${base}.intro.details`, i)} sx={{ top: -15, left: 'auto', right: 2 }} />
                    )}
                    <EditableText value={d.title} onChange={(v) => update(`${base}.intro.details.${i}.title`, v)} editorMode={editorMode} placeholder="Label" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', mb: .75 }} />
                    <EditableText value={d.copy} onChange={(v) => update(`${base}.intro.details.${i}.copy`, v)} editorMode={editorMode} multiline placeholder="Detail" sx={{ color: 'text.secondary', fontSize: 13.5 }} />
                  </Box>
                ))}
              </Box>
              {editorMode === 'edit' && (
                <Box sx={{ mt: 2 }}>
                  <AddItemButton label="Add detail" onClick={() => addItem(`${base}.intro.details`, { title: 'Label', copy: 'Detail text.' })} />
                </Box>
              )}
            </Box>

            {/* Framed image */}
            <Box sx={{ position: 'relative', px: { xs: 0, md: 3 }, py: 3 }}>
              <Box aria-hidden sx={{ position: 'absolute', top: 0, left: { xs: 0, md: 8 }, width: '62%', height: '58%', border: '2px solid', borderColor: 'text.primary', borderRadius: 2, display: { xs: 'none', md: 'block' } }} />
              <Box aria-hidden sx={{ position: 'absolute', bottom: 0, right: 8, width: '30%', height: '38%', bgcolor: 'secondary.main', borderRadius: 2, display: { xs: 'none', md: 'block' } }} />
              <Box sx={{ position: 'relative', height: { xs: 260, md: 380 }, borderRadius: 2, overflow: 'hidden',
                  '&::before': { content: '""', position: 'absolute', inset: 0, backgroundImage: `url(${project.intro.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform .5s ease, filter .35s ease, opacity .35s ease' },
                  '&:hover::before': { transform: 'scale(1.05)', filter: 'saturate(1.05) brightness(.9)', opacity: .88 },
                  '&:hover .introImageButton': { opacity: 1 },
                }}>
                  <ImageEditButton value={project.intro.image} onChange={(url) => update(`${base}.intro.image`, url)} editorMode={editorMode} label="Image" className="introImageButton" sx={{ opacity: 0 }} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Gallery */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'brand.surface' }}>
        <Container>
          <Stack sx={{ mb: 5, alignItems: 'center', textAlign: 'center' }}>
            <EditableText value={project.gallery.title} onChange={(v) => update(`${base}.gallery.title`, v)} editorMode={editorMode} placeholder="Gallery title" variant="h2" sx={{ color: 'primary.main', fontSize: { xs: 30, md: 40 } }} />
            <Box sx={{ maxWidth: 700, mt: 1.5 }}>
              <EditableText value={project.gallery.description} onChange={(v) => update(`${base}.gallery.description`, v)} editorMode={editorMode} multiline placeholder="Gallery description" sx={{ color: 'text.secondary', fontSize: 15.5 }} />
            </Box>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {project.gallery.items.map((it, i) => (
              <Box key={i} sx={{
                position: 'relative', height: { xs: 160, md: 240 }, borderRadius: 2, overflow: 'hidden', backgroundColor: '#0c3d0c',
                '&::before': { content: '""', position: 'absolute', inset: 0, backgroundImage: `url(${it.src})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform .5s ease, filter .35s ease, opacity .35s ease' },
                '&::after': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(3,40,3,.8))', transition: 'background .35s ease, opacity .35s ease' },
                '&:hover::before': { transform: 'scale(1.06)', filter: 'saturate(1.05) brightness(.88)', opacity: .9 },
                '&:hover::after': { background: 'linear-gradient(180deg, transparent 25%, rgba(3,40,3,.92))' },
                '&:hover .galleryImageButton': { opacity: 1 },
              }}>
                <ImageEditButton value={it.src} onChange={(url) => update(`${base}.gallery.items.${i}.src`, url)} editorMode={editorMode} label="Image" className="galleryImageButton" sx={{ top: '50%', right: 'auto', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
                {editorMode === 'edit' && (
                  <DeleteItemButton onDelete={() => removeItem(`${base}.gallery.items`, i)} sx={{ top: 12, right: 12, left: 'auto' }} />
                )}
                <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 2, zIndex: 2 }}>
                  <EditableText value={it.label} onChange={(v) => update(`${base}.gallery.items.${i}.label`, v)} editorMode={editorMode} placeholder="Caption" sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: 14, md: 17 }, textShadow: '0 1px 6px rgba(0,0,0,.5)' }} />
                </Box>
              </Box>
            ))}
          </Box>
          {editorMode === 'edit' && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <AddItemButton label="Add photo" onClick={() => addItem(`${base}.gallery.items`, { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', label: 'New Photo' })} />
            </Box>
          )}
        </Container>
      </Box>

      {/* Key Features */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <EditableText value={project.features.title} onChange={(v) => update(`${base}.features.title`, v)} editorMode={editorMode} placeholder="Section title" variant="h2" sx={{ color: 'text.primary', fontSize: { xs: 28, md: 38 } }} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {project.features.items.map((f, i) => (
              <Box key={i} sx={{
                position: 'relative', borderRadius: 2.5, p: { xs: 3, md: 4 },
                bgcolor: f.dark ? 'brand.greenDark' : 'brand.surface',
                color: f.dark ? '#fff' : 'text.primary',
                border: '1px solid', borderColor: f.dark ? 'transparent' : 'brand.line',
              }}>
                {editorMode === 'edit' && (
                  <DeleteItemButton onDelete={() => removeItem(`${base}.features.items`, i)} sx={{ top: 12, left: 12 }} />
                )}
                <Box sx={{ position: 'absolute', top: 24, right: 24, width: 40, height: 40, borderRadius: 1.5,
                  bgcolor: f.dark ? 'rgba(255,255,255,.15)' : '#fff', color: f.dark ? '#fff' : 'primary.main', display: 'grid', placeItems: 'center' }}>
                  <MaterialSymbol name={f.icon} sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ pr: 6 }}>
                  <EditableText value={f.title} onChange={(v) => update(`${base}.features.items.${i}.title`, v)} editorMode={editorMode} placeholder="Feature title" sx={{ fontWeight: 700, fontSize: { xs: 18, md: 21 }, textTransform: 'uppercase', letterSpacing: '.4px', mb: 1.5 }} />
                  <EditableText value={f.copy} onChange={(v) => update(`${base}.features.items.${i}.copy`, v)} editorMode={editorMode} multiline placeholder="Feature description" sx={{ fontSize: 15, color: f.dark ? 'rgba(255,255,255,.82)' : 'text.secondary' }} />
                  <IconPicker value={f.icon} onChange={(v) => update(`${base}.features.items.${i}.icon`, v)} editorMode={editorMode} />
                </Box>
              </Box>
            ))}
          </Box>
          {editorMode === 'edit' && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <AddItemButton label="Add feature" onClick={() => addItem(`${base}.features.items`, { icon: 'star', title: 'New Feature', copy: 'Describe this feature.', dark: project.features.items.length % 2 === 0 })} />
            </Box>
          )}
        </Container>
      </Box>

      {/* Inquiry (functional form; only the copy is editable) */}
      <Box component="section" sx={{ py: { xs: 8, md: 11 }, background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)', color: '#fff' }}>
        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: { xs: 5, md: 8 } }}>
            <Box>
              <EditableText value={project.inquiry.title} onChange={(v) => update(`${base}.inquiry.title`, v)} editorMode={editorMode} placeholder="Inquiry title" variant="h2" sx={{ color: '#fff', fontSize: { xs: 26, md: 34 }, mb: 2 }} />
              <Box sx={{ maxWidth: 420 }}>
                <EditableText value={project.inquiry.description} onChange={(v) => update(`${base}.inquiry.description`, v)} editorMode={editorMode} multiline placeholder="Inquiry description" sx={{ color: 'rgba(255,255,255,.82)', fontSize: 15.5, fontWeight: 300 }} />
              </Box>
            </Box>
            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <Stack spacing={3.5}>
                <TextField variant="standard" label="Full Name" value={form.name} onChange={onForm('name')} fullWidth sx={whiteField} />
                <TextField variant="standard" label="Email Address *" value={form.email} onChange={onForm('email')} fullWidth sx={whiteField} />
                <TextField variant="standard" label="Contact Number *" value={form.phone} onChange={onForm('phone')} fullWidth sx={whiteField} />
                <TextField variant="standard" label="Message (optional)" value={form.message} onChange={onForm('message')} fullWidth multiline minRows={2} sx={whiteField} />
                <Button type="submit" variant="outlined" size="large" sx={{ alignSelf: 'flex-start', color: '#fff', borderColor: 'rgba(255,255,255,.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.12)' } }}>
                  Submit
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
