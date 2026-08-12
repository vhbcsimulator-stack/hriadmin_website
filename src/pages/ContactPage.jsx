import { useState } from 'react'
import {
  Box, Container, Typography, Stack, TextField, MenuItem, Button, IconButton, Alert,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import PageEditorShell, { AddItemButton, DeleteItemButton } from '../components/PageEditorShell'
import { EditableText, IconPicker } from '../components/Editable'
import MaterialSymbol from '../../../shared/content/MaterialSymbol'
import { CONTACT_PAGE_ID, contactContentData, saveContactContent } from '../../../shared/content/contactContent'

const PROPERTY_OPTIONS = ['Residential', 'Commercial']

// Social networks keep their brand logos (Material Symbols has no brand marks),
// so `network` from content maps to a fixed icon here.
const SOCIAL_ICONS = {
  facebook: <FacebookIcon fontSize="small" />,
  instagram: <InstagramIcon fontSize="small" />,
}
const socialIcon = (network) => SOCIAL_ICONS[network] || <HelpOutlineIcon fontSize="small" />

const EMPTY = { first: '', last: '', email: '', phone: '', interest: '', message: '' }

// The inquiry form is functional, not editable copy — it keeps its own local
// state exactly like the public page so the editor previews real behaviour.
function InquiryForm() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((err) => ({ ...err, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.first.trim()) next.first = 'Required'
    if (!form.last.trim()) next.last = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.message.trim()) next.message = 'Required'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
    setForm(EMPTY)
  }

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      {sent && (
        <Alert severity="success" onClose={() => setSent(false)} sx={{ mb: 3 }}>
          Thank you! Your message has been received. A specialist will contact you soon.
        </Alert>
      )}
      <Box component="form" onSubmit={submit} noValidate>
        <Stack spacing={2.75}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.75 }}>
            <TextField label="First Name *" value={form.first} onChange={update('first')} error={!!errors.first} helperText={errors.first} fullWidth />
            <TextField label="Last Name *" value={form.last} onChange={update('last')} error={!!errors.last} helperText={errors.last} fullWidth />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.75 }}>
            <TextField label="Email Address *" value={form.email} onChange={update('email')} error={!!errors.email} helperText={errors.email} fullWidth />
            <TextField label="Phone Number" value={form.phone} onChange={update('phone')} fullWidth />
          </Box>
          <TextField select label="Property Interest" value={form.interest} onChange={update('interest')} fullWidth>
            <MenuItem value=""><em>Select a Property</em></MenuItem>
            {PROPERTY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
          <TextField label="Message *" value={form.message} onChange={update('message')} error={!!errors.message} helperText={errors.message} placeholder="How can we help you?" fullWidth multiline minRows={4} />
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, px: 4 }}>
            Submit Message
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

// Hero band.
function Hero({ content, editorMode, update }) {
  const { hero } = content
  return (
    <Box sx={{ background: 'linear-gradient(150deg, #006600 0%, #024A01 60%, #032803 100%)', color: '#fff', pt: { xs: 14, md: 17 }, pb: { xs: 14, md: 10 }, textAlign: 'center' }}>
      <Container>
        <EditableText
          value={hero.eyebrow}
          onChange={(value) => update('hero.eyebrow', value)}
          editorMode={editorMode}
          placeholder="Eyebrow"
          sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: { xs: 13, md: 15 }, fontWeight: 600, color: '#a8ffa8', mb: 1.5 }}
        />
        <EditableText
          value={hero.title}
          onChange={(value) => update('hero.title', value)}
          editorMode={editorMode}
          placeholder="Title"
          variant="h1"
          sx={{ fontSize: { xs: 42, md: 72 }, fontWeight: 800 }}
        />
        <Box sx={{ width: 90, height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,.7)', mt: 3, mx: 'auto' }} />
        <Box sx={{ maxWidth: 620, mx: 'auto', mt: 3 }}>
          <EditableText
            value={hero.subtitle}
            onChange={(value) => update('hero.subtitle', value)}
            editorMode={editorMode}
            multiline
            placeholder="Subtitle"
            sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.9)' }}
          />
        </Box>
      </Container>
    </Box>
  )
}

// Inquiry panel: editable green sidebar + the functional form.
function Inquiry({ content, editorMode, update, addItem, removeItem }) {
  const { inquiry } = content
  return (
    <Box component="section" sx={{ pb: { xs: 8, md: 12 } }}>
      <Container sx={{ mt: { xs: 8, md: 12 } }}>
        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.85fr 1.15fr' },
          bgcolor: '#fff', borderRadius: 4, overflow: 'hidden',
          boxShadow: '0 30px 70px -30px rgba(3, 3, 3, 0.5)',
        }}>
          {/* Info sidebar (brand green) */}
          <Box sx={{
            position: 'relative', color: '#fff', p: { xs: 4, md: 5 }, overflow: 'hidden',
            background: 'linear-gradient(160deg, #006600 0%, #024A01 55%, #021c02 100%)',
          }}>
            <Box aria-hidden sx={{ position: 'absolute', right: -50, bottom: -50, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.06)' }} />
            <Box sx={{ position: 'relative' }}>
              <EditableText
                value={inquiry.heading}
                onChange={(value) => update('inquiry.heading', value)}
                editorMode={editorMode}
                placeholder="Sidebar heading"
                variant="h2"
                sx={{ color: '#fff', textTransform: 'none', fontSize: { xs: 24, md: 28 }, mb: 1.5 }}
              />
              <EditableText
                value={inquiry.description}
                onChange={(value) => update('inquiry.description', value)}
                editorMode={editorMode}
                multiline
                placeholder="Sidebar description"
                sx={{ color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 300, mb: 4 }}
              />

              <Stack spacing={2.75}>
                {inquiry.info.map((info, index) => (
                  <Stack key={index} direction="row" spacing={2} sx={{ position: 'relative', alignItems: 'flex-start', pr: editorMode === 'edit' ? 5 : 0 }}>
                    <Box sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: 2, bgcolor: 'rgba(255,255,255,.14)', display: 'grid', placeItems: 'center' }}>
                      <MaterialSymbol name={info.icon} sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <EditableText
                        value={info.label}
                        onChange={(value) => update(`inquiry.info.${index}.label`, value)}
                        editorMode={editorMode}
                        placeholder="Label"
                        sx={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.5px', color: '#a8ffa8' }}
                      />
                      <EditableText
                        value={info.value}
                        onChange={(value) => update(`inquiry.info.${index}.value`, value)}
                        editorMode={editorMode}
                        placeholder="Value"
                        sx={{ fontSize: 15, fontWeight: 500 }}
                      />
                      <IconPicker
                        value={info.icon}
                        onChange={(value) => update(`inquiry.info.${index}.icon`, value)}
                        editorMode={editorMode}
                      />
                    </Box>
                    {editorMode === 'edit' && (
                      <DeleteItemButton onDelete={() => removeItem('inquiry.info', index)} sx={{ top: 0, left: 'auto', right: 0 }} />
                    )}
                  </Stack>
                ))}
              </Stack>
              {editorMode === 'edit' && (
                <Box sx={{ mt: 2 }}>
                  <AddItemButton
                    label="Add contact detail"
                    onClick={() => addItem('inquiry.info', { icon: 'star', label: 'New Label', value: 'New value' })}
                  />
                </Box>
              )}

              <Box sx={{ mt: 4, mb: 1.5 }}>
                <EditableText
                  value={inquiry.socialsLabel}
                  onChange={(value) => update('inquiry.socialsLabel', value)}
                  editorMode={editorMode}
                  placeholder="Socials label"
                  sx={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '.5px', color: '#a8ffa8' }}
                />
              </Box>
              <Stack direction="row" spacing={1.5}>
                {inquiry.socials.filter((s) => s.network !== 'linkedin').map((s, index) => (
                  <IconButton key={index} aria-label={s.network} disableRipple
                    sx={{ bgcolor: 'rgba(255,255,255,.14)', color: '#fff', width: 40, height: 40 }}>
                    {socialIcon(s.network)}
                  </IconButton>
                ))}
              </Stack>
              {/* Social links are edited by URL — the brand icon is fixed per network. */}
              {editorMode === 'edit' && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {inquiry.socials
                    .map((s, index) => ({ s, index }))
                    .filter(({ s }) => s.network !== 'linkedin')
                    .map(({ s, index }) => (
                    <Stack key={index} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 90, fontSize: 12, textTransform: 'capitalize', color: 'rgba(255,255,255,.85)' }}>{s.network}</Box>
                      <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,.1)', borderRadius: 1, px: 1 }}>
                        <EditableText
                          value={s.href}
                          onChange={(value) => update(`inquiry.socials.${index}.href`, value)}
                          editorMode={editorMode}
                          placeholder="https://…"
                          sx={{ fontSize: 12, color: '#fff' }}
                        />
                      </Box>
                    </Stack>
                    ))}
                </Stack>
              )}
            </Box>
          </Box>

          {/* Form (functional, not editable) */}
          <InquiryForm />
        </Box>
      </Container>
    </Box>
  )
}

// Embedded location map, with an editable embed URL in edit mode.
function LocationMap({ content, editorMode, update }) {
  const { map } = content
  return (
    <Box component="section">
      {editorMode === 'edit' && (
        <Container sx={{ py: 2 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: .5 }}>Map embed URL(Copy the "https" URL from Google Maps "Embed a Map" only)</Typography>
          <Box sx={{ border: '1px solid', borderColor: 'brand.line', borderRadius: 1, px: 1.5, py: .5 }}>
            <EditableText
              value={map.embedSrc}
              onChange={(value) => update('map.embedSrc', value)}
              editorMode={editorMode}
              placeholder="https://www.google.com/maps?q=…&output=embed"
              sx={{ fontSize: 13, color: 'text.secondary', wordBreak: 'break-all' }}
            />
          </Box>
        </Container>
      )}
      <Box sx={{ height: { xs: 320, md: 420 } }}>
        <Box
          component="iframe"
          title="Office location map"
          src={map.embedSrc}
          sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
    </Box>
  )
}

// FAQ accordion list.
function Faq({ content, editorMode, update, addItem, removeItem }) {
  const { faq } = content
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(0,0,255,0.03)' }}>
      <Container maxWidth="md">
        <Stack sx={{ mb: 6, alignItems: 'center', textAlign: 'center' }}>
          <EditableText
            value={faq.title}
            onChange={(value) => update('faq.title', value)}
            editorMode={editorMode}
            placeholder="FAQ title"
            variant="h2"
            sx={{ color: 'text.primary', textTransform: 'none', fontSize: { xs: 28, md: 38 } }}
          />
          <Box sx={{ width: 260, maxWidth: '70%', height: 2, bgcolor: 'brand.line', mt: 2 }} />
        </Stack>

        <Stack spacing={2}>
          {faq.items.map((f, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <Accordion disableGutters elevation={0}
                sx={{ borderRadius: '12px !important', border: '1px solid', borderColor: 'brand.line', '&:before': { display: 'none' }, overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1, pr: editorMode === 'edit' ? 7 : 2.5, '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5 } }}>
                  <HelpOutlineIcon sx={{ color: 'GREEN' }} />
                  <Box sx={{ width: '100%' }}>
                    <EditableText
                      value={f.q}
                      onChange={(value) => update(`faq.items.${index}.q`, value)}
                      editorMode={editorMode}
                      placeholder="Question"
                      sx={{ fontWeight: 500, fontSize: 16 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0, pl: 6 }}>
                  <EditableText
                    value={f.a}
                    onChange={(value) => update(`faq.items.${index}.a`, value)}
                    editorMode={editorMode}
                    multiline
                    placeholder="Answer"
                    sx={{ color: 'text.secondary', fontSize: 15 }}
                  />
                </AccordionDetails>
              </Accordion>
              {editorMode === 'edit' && (
                <DeleteItemButton onDelete={() => removeItem('faq.items', index)} sx={{ top: 8, left: 'auto', right: 8 }} />
              )}
            </Box>
          ))}
        </Stack>
        {editorMode === 'edit' && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <AddItemButton
              label="Add question"
              onClick={() => addItem('faq.items', { q: 'New question?', a: 'Answer goes here.' })}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

// Contact page editor. Navbar/Footer come from the shared admin Layout; the
// editor toolbar and content plumbing come from PageEditorShell.
export default function ContactPage() {
  return (
    <PageEditorShell
      pageId={CONTACT_PAGE_ID}
      title="Contact Page"
      defaults={contactContentData}
      saveContent={saveContactContent}
    >
      {(editor) => (
        <Box>
          <Hero {...editor} />
          <Inquiry {...editor} />
          <LocationMap {...editor} />
          <Faq {...editor} />
        </Box>
      )}
    </PageEditorShell>
  )
}
