import { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  Avatar,
  IconButton,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import PageEditorShell, { AddItemButton, DeleteItemButton } from '../components/PageEditorShell'
import { EditableText, ImageEditButton, IconPicker, ColorPicker } from '../components/Editable'
import MaterialSymbol from '../shared/content/MaterialSymbol'
import { HOME_PAGE_ID, homeContentData, saveHomeContent } from '../shared/content/homeContent'

// Geometry of the hero's split layout — kept in step with the public page's
// Hero so the editor previews what visitors get. Both the photo panel and the
// hairline arc that echoes it are right-anchored, so width is what positions
// their left edge; the two have to change together or the gap drifts.
const HERO_PANEL_WIDTH = { xs: '100%', md: '52%', lg: '60%' }
const HERO_TRACE_WIDTH = { md: 'calc(52% + 34px)', lg: 'calc(60% + 34px)' }
const HERO_GUTTER = { xs: 3, sm: 5, md: 8, lg: 10 }

// Hero banner section. Split layout: copy on a light field at left, photo
// bleeding off the right edge behind a tall convex curve.
function Hero({ content, editorMode, update }) {
  const bgRef = useRef(null)
  const isEditing = editorMode === 'edit'

  // Zoom the house image as the user scrolls through the hero, so it feels
  // like moving into the house. Driven imperatively via rAF to avoid re-renders.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const p = Math.min(window.scrollY / window.innerHeight, 1)
        if (bgRef.current) {
          bgRef.current.style.transform = `scale(${1 + p * 0.5}) translateY(${p * 60}px)`
          bgRef.current.style.opacity = String(1 - p * 0.2)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        minHeight: { xs: '88vh', md: '92vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: '#f7f7f3',
        overflow: 'hidden',
      }}
    >
      {/* Image layer — now the curved panel on the right rather than a
          full-bleed backdrop. Hovering it (i.e. anywhere but the copy, which
          sits above on its own z-index) reveals the edit control, darkens the
          photo and fades the copy back so the image reads as the thing being
          edited. The control lives inside this layer so reaching for it keeps
          the hover. The clip lives here too, so the parallax transform below
          happens inside the curve and the arc itself stays put. */}
      <Box
        className="heroImageLayer"
        sx={{
          position: 'absolute', top: 0, bottom: 0, zIndex: 1,
          // Bleeds past the right edge from md so the panel reads as a slice of
          // something larger instead of a shape pinned to the viewport.
          right: { xs: 0, md: -48 },
          width: HERO_PANEL_WIDTH,
          overflow: 'hidden',
          // The value before the slash is the arc's horizontal reach; keeping it
          // well under 50% stops the mid-height bulge reaching the body copy.
          borderRadius: { xs: 0, md: '34% 0 0 34% / 50% 0 0 50%' },
          borderLeft: 10, borderColor: '#052905', borderStyle: 'solid',
          ...(isEditing && {
              '&:hover .heroImageMedia': { transform: 'scale(1.04)', filter: 'saturate(1.05) brightness(.88)', opacity: .88 },
            '&:hover .heroImageScrim': { opacity: 1 },
            '&:hover .heroImageControls': { opacity: 1 },
            '&:hover .heroImageButton': { opacity: 1 },
            '&:hover ~ .heroContent': { opacity: .35 },
          }),
        }}
      >
        <Box ref={bgRef} className="heroImageMedia" aria-hidden sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${content.hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#052905',
          transformOrigin: 'center 55%',
          willChange: 'transform',
        }} />
        {/* Light tint from md, where the photo is only a panel; heavy below md,
            where it turns into the backdrop the copy has to read against. */}
        <Box aria-hidden sx={{
          position: 'absolute', inset: 0,
          background: {
            xs: 'linear-gradient(180deg, rgba(3,40,3,.55) 0%, rgba(2,20,2,.72) 100%)',
            md: 'linear-gradient(180deg, rgba(3,40,3,.10) 0%, rgba(2,20,2,.26) 100%)',
          },
        }} />
        <Box className="heroImageScrim" aria-hidden sx={{
          position: 'absolute', inset: 0,
          bgcolor: 'rgba(0,0,0,.45)',
          opacity: 0,
          transition: 'opacity .35s ease',
        }} />
        <Box className="heroImageControls" sx={{ opacity: 0, transition: 'opacity .35s ease' }}>
          <ImageEditButton
            value={content.hero.image}
            onChange={(url) => update('hero.image', url)}
            editorMode={editorMode}
            label="Edit image"
            className="heroImageButton"
            // Offset right from md to clear the panel's 48px bleed — at 24 the
            // button would sit off-canvas.
            sx={{ top: 24, right: { xs: 24, md: 88 }, opacity: 0 }}
          />
        </Box>
      </Box>
      {/* Hairline arc echoing the photo curve. Same shape, but wider — it is
          right-anchored, so the extra width is what pushes the visible edge out
          onto the light field. Only the left border is drawn; the other three
          are 0-width, which makes the browser paint the whole top-left and
          bottom-left radius with the left border and gives one unbroken arc
          rather than horizontal lines at the hero's top and bottom. */}
      <Box aria-hidden sx={{
        display: { xs: 'none', md: 'block' },
        position: 'absolute', top: -24, bottom: -24, pointerEvents: 'none',
        zIndex: 2,
        right: -48,
        width: HERO_TRACE_WIDTH,
        borderRadius: '34% 0 0 34% / 50% 0 0 50%',
        borderStyle: 'solid',
        borderColor: 'rgba(2,74,1,.28)',
        borderWidth: '0 0 0 1.5px',
      }} />

      <Box aria-hidden sx={{
        display: { xs: 'none', md: 'block' },
        position: 'absolute', top: -24, bottom: -24, pointerEvents: 'none',
        // Sits above the photo so the arc stays visible where the two shapes
        // cross near the top and bottom; below the copy container.
        zIndex: 2,
        right: -70,
        width: HERO_TRACE_WIDTH,
        borderRadius: '34% 0 0 34% / 50% 0 0 50%',
        borderStyle: 'solid',
        borderColor: 'rgba(2,74,1,.28)',
        borderWidth: '0 0 0 1.5px',
      }} />
      {/* pointerEvents: none so only the copy itself — not the container's empty
          gutters — counts as "over the words" for the image layer's hover. */}
      <Container
        maxWidth={false}
        className="heroContent"
        sx={{
          position: 'relative', zIndex: 2, px: HERO_GUTTER, py: { xs: 12, md: 14 },
          pointerEvents: 'none',
          transition: 'opacity .35s ease',
        }}
      >
        {/* Percentage width so the column always clears the curve's mid-height
            bulge. Below md the copy sits over the photo, so it flips to light
            colours — same switch as the public page. */}
        <Box sx={{
          maxWidth: { xs: '100%', md: '48%', lg: '40%' },
          pointerEvents: 'auto',
        }}>
          <EditableText
            value={content.hero.eyebrow}
            onChange={(value) => update('hero.eyebrow', value)}
            editorMode={editorMode}
            placeholder="Eyebrow"
            sx={{
              textTransform: 'uppercase', letterSpacing: { xs: '2.5px', md: '4px' },
              fontSize: { xs: 11.5, md: 13 }, fontWeight: 500,
              color: { xs: '#fff', md: '#0d1f0d' }, mb: 2,
            }}
          />
          <EditableText
            value={content.hero.title}
            onChange={(value) => update('hero.title', value)}
            editorMode={editorMode}
            placeholder="Headline"
            variant="h1"
            sx={{ fontSize: { xs: 32, sm: 44, md: 52, lg: 68 }, lineHeight: 1.08, color: { xs: '#fff', md: '#024A01' } }}
          />
          <EditableText
            value={content.hero.titleHighlight}
            onChange={(value) => update('hero.titleHighlight', value)}
            editorMode={editorMode}
            placeholder="Highlighted headline"
            variant="h1"
            sx={{ fontSize: { xs: 32, sm: 44, md: 52, lg: 68 }, lineHeight: 1.08, color: { xs: '#a8ffa8', md: '#0000b4' }, fontWeight: 700 }}
          />
          {/* Rule-and-dot separating the title from the supporting copy. */}
          <Stack direction="row" spacing={1} aria-hidden sx={{ mt: { xs: 2.5, md: 3.5 }, alignItems: 'center' }}>
            <Box sx={{ width: 84, height: 3, bgcolor: { xs: '#a8ffa8', md: '#024A01' } }} />
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: { xs: '#a8ffa8', md: '#024A01' } }} />
          </Stack>
          <EditableText
            value={content.hero.subtitle}
            onChange={(value) => update('hero.subtitle', value)}
            editorMode={editorMode}
            multiline
            placeholder="Hero subtitle"
            sx={{
              mt: { xs: 2, md: 3 }, maxWidth: 560, fontSize: { xs: 15, sm: 16, md: 16.5 },
              fontWeight: 300, lineHeight: 1.7,
              color: { xs: 'rgba(255,255,255,.9)', md: '#3a463a' },
            }}
          />
          <Stack direction="row" spacing={1.75} sx={{ mt: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
            <Button variant="contained" color="secondary" size="large" disableRipple
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 999, px: 3.5 }}>
              <EditableText
                value={content.hero.primaryCta}
                onChange={(value) => update('hero.primaryCta', value)}
                editorMode={editorMode}
                placeholder="Primary button"
                component="span"
                sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}
              />
            </Button>
            <Button variant="outlined" size="large" disableRipple
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 999, px: 3.5,
                color: { xs: '#fff', md: '#032803' },
                bgcolor: { xs: 'transparent', md: '#fff' },
                borderColor: { xs: 'rgba(255,255,255,.7)', md: 'rgba(3,40,3,.25)' },
                '&:hover': { borderColor: { xs: '#fff', md: '#032803' }, bgcolor: 'rgba(3,40,3,.12)' },
              }}>
              <EditableText
                value={content.hero.secondaryCta}
                onChange={(value) => update('hero.secondaryCta', value)}
                editorMode={editorMode}
                placeholder="Secondary button"
                component="span"
                sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}
              />
            </Button>
          </Stack>
        </Box>
      </Container>
      {/* Scroll cue. It lands on the seam between the light field and the photo,
          so it has to read against both: a solid white pill carries the green
          icon over either one. */}
      <IconButton href="#projects" aria-label="Scroll down"
        sx={{
          display: { xs: 'none', sm: 'inline-flex' },
          position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 5,
          color: '#024A01',
          bgcolor: '#fff',
          border: '1.5px solid #024A01',
          boxShadow: '0 6px 18px -6px rgba(2,40,2,.45)',
          animation: 'bob 2s ease-in-out infinite',
          '@keyframes bob': { '0%,100%': { transform: 'translate(-50%,0)' }, '50%': { transform: 'translate(-50%,8px)' } },
          '&:hover': { bgcolor: '#024A01', color: '#fff' },
        }}>
        <KeyboardArrowDownIcon />
      </IconButton>
    </Box>
  )
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

// Featured properties showcase.
function FeaturedProjects({ content, editorMode, update, addItem, removeItem }) {
  return (
    <Box component="section" id="projects" sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <Box sx={{ mb: 5.5, maxWidth: 700 }}>
          <EditableText
            value={content.featured.eyebrow}
            onChange={(value) => update('featured.eyebrow', value)}
            editorMode={editorMode}
            placeholder="Eyebrow"
            sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: 'primary.main', mb: 1 }}
          />
          <EditableText
            value={content.featured.title}
            onChange={(value) => update('featured.title', value)}
            editorMode={editorMode}
            placeholder="Section title"
            variant="h2"
            sx={{ fontSize: { xs: 28, md: 40 } }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3.5 }}>
          {content.featured.items.map((project, index) => (
            <Card key={index} elevation={0}
              sx={{
                textDecoration: 'none',
                position: 'relative', minHeight: { xs: 580, md: 700 }, display: 'flex', alignItems: 'flex-end',
                borderRadius: 1, overflow: 'hidden', color: '#fff',
                boxShadow: '0 18px 40px -12px rgba(0, 0, 0, 0.28)',
                transition: 'transform .35s ease, box-shadow .35s ease',
                backgroundColor: '#0c3d0c',
                '&::before': {
                  content: '""', position: 'absolute', inset: 0,
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform .5s ease, filter .35s ease, opacity .35s ease',
                },
                '&::after': {
                  content: '""', position: 'absolute', inset: 0,
                  background: `linear-gradient(200deg, ${project.tint}4d, transparent 55%)`,
                  transition: 'background .35s ease, opacity .35s ease',
                },
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 28px 52px -20px rgba(0, 0, 0, 0.42)',
                },
                '&:hover::before': {
                  transform: 'scale(1.06)',
                  filter: 'saturate(1.08) brightness(.88)',
                  opacity: .88,
                },
                '&:hover::after': {
                  background: `linear-gradient(200deg, ${project.tint}66, rgba(0,0,0,.06) 55%, rgba(0,0,0,.38) 100%)`,
                  opacity: 1,
                },
                '&:hover .exploreLink': { gap: 1.75 },
                '&:hover .cardImageButton': { opacity: 1 },
              }}
            >
              <ImageEditButton
                value={project.image}
                onChange={(url) => update(`featured.items.${index}.image`, url)}
                editorMode={editorMode}
                label="Edit image"
                className="cardImageButton"
                sx={{ top: '50%', right: 'auto', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }}
              />
              {editorMode === 'edit' && (
                <DeleteItemButton
                  onDelete={() => removeItem('featured.items', index)}
                  sx={{ top: 12, right: 12, left: 'auto' }}
                />
              )}

              <Box sx={{
                position: 'absolute', top: 20, left: 20, zIndex: 3, bgcolor: 'rgba(255, 215, 0, 0.60)', color: 'rgb(20, 30, 60)',
                fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                px: 1.75, py: .75, borderRadius: 1.5,
                display: editorMode === 'edit' || project.tag ? 'block' : 'none',
                minWidth: editorMode === 'edit' ? 120 : 0,
              }}>
                <EditableText
                  value={project.tag}
                  onChange={(value) => update(`featured.items.${index}.tag`, value)}
                  editorMode={editorMode}
                  placeholder="Badge (optional)"
                  component="span"
                  sx={{ fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}
                />
              </Box>

              <Box aria-hidden sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,.88) 22%, rgba(0,0,0,.55) 40%, transparent 62%)',
              }} />
              <Box sx={{ position: 'relative', zIndex: 2, p: 4, width: '100%' }}>
                <EditableText
                  value={project.title}
                  onChange={(value) => update(`featured.items.${index}.title`, value)}
                  editorMode={editorMode}
                  placeholder="Card title"
                  variant="h3"
                  sx={{ fontSize: 22, textTransform: 'uppercase', letterSpacing: '.4px' }}
                />
                <EditableText
                  value={project.copy}
                  onChange={(value) => update(`featured.items.${index}.copy`, value)}
                  editorMode={editorMode}
                  multiline
                  placeholder="Card description"
                  sx={{ mt: 1.25, fontSize: 14.5, color: 'rgba(255,255,255,.85)', maxWidth: '90%' }}
                />
                <ColorPicker
                  value={project.tint}
                  onChange={(value) => update(`featured.items.${index}.tint`, value)}
                  editorMode={editorMode}
                  label="Card tint"
                />
                <Stack className="exploreLink" direction="row" spacing={1}
                  sx={{ mt: 2.25, ml: 'auto', width: 'fit-content', alignItems: 'center', color: '#a8ffa8', fontWeight: 600, fontSize: 13, letterSpacing: '1.5px',
                    textTransform: 'uppercase', transition: 'gap .2s ease' }}>
                  <EditableText
                    value={project.linkLabel}
                    onChange={(value) => update(`featured.items.${index}.linkLabel`, value)}
                    editorMode={editorMode}
                    placeholder="Link label"
                    component="span"
                    sx={{ fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}
                  />
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Stack>
              </Box>
            </Card>
          ))}
        </Box>

        {editorMode === 'edit' && (
          <Box sx={{ mt: 3 }}>
            <AddItemButton
              label="Add featured project"
              onClick={() => addItem('featured.items', {
                tag: '',
                title: 'New Project',
                copy: 'Describe this property offering.',
                tint: '#006600',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
                linkLabel: 'Explore',
              })}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

// About section with trust-building points.
function WhyChooseUs({ content, editorMode, update, addItem, removeItem }) {
  return (
    <Box component="section" id="about" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'brand.surface' }}>
      <Container>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.05fr' }, gap: { xs: 5, md: 7 }, alignItems: 'center' }}>
          <Box>
            <EditableText
              value={content.whyChooseUs.eyebrow}
              onChange={(value) => update('whyChooseUs.eyebrow', value)}
              editorMode={editorMode}
              placeholder="Eyebrow"
              sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: 'primary.main', mb: 1 }}
            />
            <EditableText
              value={content.whyChooseUs.description}
              onChange={(value) => update('whyChooseUs.description', value)}
              editorMode={editorMode}
              multiline
              placeholder="Section description"
              sx={{ mt: 1, color: 'text.secondary', fontSize: 16.5, maxWidth: 460 }}
            />

            <Stack spacing={2.75} sx={{ mt: 4.5 }}>
              {content.whyChooseUs.reasons.map((reason, index) => {
                return (
                  <Stack key={index} direction="row" spacing={2} sx={{
                    position: 'relative',
                    alignItems: 'flex-start', p: 1.5, mx: -1.5, borderRadius: 2, cursor: 'default',
                    pr: editorMode === 'edit' ? 6 : 1.5,
                    transition: 'background .25s ease, transform .25s ease, box-shadow .25s ease',
                    '&:hover': { bgcolor: '#fff' },
                    '&:hover .reasonTitle': { color: 'primary.main' },
                  }}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                      <MaterialSymbol name={reason.icon} />
                    </Avatar>
                    <Box sx={{ width: '100%' }}>
                      <EditableText
                        value={reason.title}
                        onChange={(value) => update(`whyChooseUs.reasons.${index}.title`, value)}
                        editorMode={editorMode}
                        placeholder="Reason title"
                        className="reasonTitle"
                        sx={{ fontWeight: 600, fontSize: 15, textTransform: 'uppercase', letterSpacing: '.6px', transition: 'color .25s ease' }}
                      />
                      <EditableText
                        value={reason.copy}
                        onChange={(value) => update(`whyChooseUs.reasons.${index}.copy`, value)}
                        editorMode={editorMode}
                        multiline
                        placeholder="Reason description"
                        sx={{ fontSize: 14.5, color: 'text.secondary' }}
                      />
                      <IconPicker
                        value={reason.icon}
                        onChange={(value) => update(`whyChooseUs.reasons.${index}.icon`, value)}
                        editorMode={editorMode}
                      />
                    </Box>
                    {editorMode === 'edit' && (
                      <DeleteItemButton
                        onDelete={() => removeItem('whyChooseUs.reasons', index)}
                        sx={{ top: 8, left: 'auto', right: 8 }}
                      />
                    )}
                  </Stack>
                )
              })}
            </Stack>

            {editorMode === 'edit' && (
              <Box sx={{ mt: 3 }}>
                <AddItemButton
                  label="Add reason"
                  onClick={() => addItem('whyChooseUs.reasons', {
                    icon: 'star',
                    title: 'New Reason',
                    copy: 'Describe why clients can rely on HRI.',
                  })}
                />
              </Box>
            )}
          </Box>

          <Box sx={{
            position: 'relative',
            '&:hover .whyImage::before': { transform: 'scale(1.08)', filter: 'saturate(1.05) brightness(.9)', opacity: .88 },
            '&:hover .whyImageButton': { opacity: 1 },
            '&:hover .whyQuote': { transform: { md: 'translateY(-6px)' } },
          }}>
            <Box className="whyImage" aria-hidden sx={{
              height: { xs: 320, md: 420 }, borderRadius: 1, position: 'relative', overflow: 'hidden',
              backgroundColor: '#1c1712',
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                backgroundImage: `url(${content.whyChooseUs.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform .6s ease, filter .35s ease, opacity .35s ease',
              },
            }} />
            <ImageEditButton
              value={content.whyChooseUs.image}
              onChange={(url) => update('whyChooseUs.image', url)}
              editorMode={editorMode}
              label="Edit image"
              className="whyImageButton"
              sx={{ opacity: 0 }}
            />
            <Card className="whyQuote" elevation={0} sx={{
              mt: { xs: 2, md: 0 },
              position: { xs: 'static', md: 'absolute' }, right: 0, bottom: -28,
              maxWidth: { md: 320 }, p: 2.5, borderRadius: 2,
              borderLeft: '4px solid', borderColor: 'primary.main',
              transition: 'transform .3s ease',
            }}>
              <EditableText
                value={content.whyChooseUs.quote}
                onChange={(value) => update('whyChooseUs.quote', value)}
                editorMode={editorMode}
                multiline
                placeholder="Pull quote"
                sx={{ fontSize: 14, color: 'text.primary' }}
              />
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// Feature-focused spotlight section.
function PropertyFeatures({ content, editorMode, update, addItem, removeItem }) {
  return (
    <Box component="section" sx={{
      position: 'relative', py: { xs: 9, md: 12.5 }, color: '#fff', overflow: 'hidden',
      background: 'linear-gradient(140deg, #006600 0%, #032803 48%, #021c02 100%)',
    }}>
      <Box aria-hidden sx={{
        position: 'absolute', left: '50%', bottom: '-4%', transform: 'translateX(-50%)',
        fontSize: { xs: 120, md: 300 }, fontWeight: 800, letterSpacing: '8px', lineHeight: 1,
        color: 'rgba(255,255,255,.06)', pointerEvents: 'none', userSelect: 'none',
      }}>
        {content.propertyFeatures.watermark}
      </Box>
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr .85fr' }, gap: { xs: 5, md: 7 }, alignItems: 'center' }}>
          <Box>
            <Typography aria-hidden sx={{ color: '#8fe08f', letterSpacing: '3px', fontSize: 14 }}>/////////</Typography>
            <EditableText
              value={content.propertyFeatures.title}
              onChange={(value) => update('propertyFeatures.title', value)}
              editorMode={editorMode}
              placeholder="Section title"
              variant="h2"
              sx={{ color: '#fff', fontSize: { xs: 34, md: 56 }, fontWeight: 800, mt: 1 }}
            />
            <EditableText
              value={content.propertyFeatures.description}
              onChange={(value) => update('propertyFeatures.description', value)}
              editorMode={editorMode}
              multiline
              placeholder="Section description"
              sx={{ mt: 2.5, maxWidth: 520, fontSize: 16.5, fontWeight: 300, color: 'rgba(255,255,255,.82)' }}
            />
            <EditableText
              value={content.propertyFeatures.featuresLabel}
              onChange={(value) => update('propertyFeatures.featuresLabel', value)}
              editorMode={editorMode}
              placeholder="Features label"
              sx={{
                mt: 4.25, textTransform: 'uppercase', letterSpacing: '2px', fontSize: 12.5, fontWeight: 600,
                color: '#a8ffa8', pb: 1.5, borderBottom: '1px solid rgba(255,255,255,.18)',
              }}
            />
            {editorMode === 'edit' && (
              <EditableText
                value={content.propertyFeatures.watermark}
                onChange={(value) => update('propertyFeatures.watermark', value)}
                editorMode={editorMode}
                placeholder="Background watermark word"
                sx={{ mt: 2, fontSize: 12, letterSpacing: '2px', color: 'rgba(255,255,255,.55)' }}
              />
            )}

            <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.75 }}>
              {content.propertyFeatures.features.map((feature, index) => (
                <Box key={index} sx={{
                  position: 'relative',
                  p: 1.5, mx: -1.5, borderRadius: 1.5, cursor: 'default',
                  pt: editorMode === 'edit' ? 5 : 1.5,
                  transition: 'background .25s ease, transform .25s ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,.07)' },
                  '&:hover .keyTitle': { color: '#a8ffa8' },
                }}>
                  {editorMode === 'edit' && (
                    <DeleteItemButton
                      onDelete={() => removeItem('propertyFeatures.features', index)}
                      sx={{ top: 4, left: 'auto', right: 4 }}
                    />
                  )}
                  <EditableText
                    value={feature.title}
                    onChange={(value) => update(`propertyFeatures.features.${index}.title`, value)}
                    editorMode={editorMode}
                    placeholder="Feature title"
                    variant="h4"
                    className="keyTitle"
                    sx={{ color: '#fff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '.5px', transition: 'color .25s ease' }}
                  />
                  <EditableText
                    value={feature.copy}
                    onChange={(value) => update(`propertyFeatures.features.${index}.copy`, value)}
                    editorMode={editorMode}
                    multiline
                    placeholder="Feature description"
                    sx={{ mt: 1, fontSize: 13, color: 'rgba(255,255,255,.7)' }}
                  />
                </Box>
              ))}
            </Box>

            {editorMode === 'edit' && (
              <Box sx={{ mt: 3 }}>
                <AddItemButton
                  label="Add key feature"
                  onClick={() => addItem('propertyFeatures.features', {
                    title: 'New Feature',
                    copy: 'Describe this property highlight.',
                  })}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ position: 'relative', '&:hover .propertyImageButton': { opacity: 1 } }}>
            <Box aria-hidden sx={{
              height: { xs: 320, md: 460 }, borderRadius: 1, position: 'relative', overflow: 'hidden',
              backgroundColor: '#0f3d0f',
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                backgroundImage: `url(${content.propertyFeatures.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform .6s ease, filter .35s ease, opacity .35s ease',
              },
              '&::after': {
                content: '""', position: 'absolute', inset: 0,
                background: 'linear-gradient(160deg, rgba(0,102,0,.15), rgba(3,40,3,.35))',
                transition: 'background .35s ease, opacity .35s ease',
              },
              '&:hover::before': { transform: 'scale(1.08)', filter: 'saturate(1.05) brightness(.88)', opacity: .9 },
              '&:hover::after': { background: 'linear-gradient(160deg, rgba(0,102,0,.34), rgba(3,40,3,.5))' },
            }} />
            <ImageEditButton
              value={content.propertyFeatures.image}
              onChange={(url) => update('propertyFeatures.image', url)}
              editorMode={editorMode}
              label="Edit image"
              className="propertyImageButton"
              sx={{ opacity: 0 }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// Testimonial cards section.
function Testimonials({ content, editorMode, update, addItem, removeItem }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <Box sx={{ mb: 5.5, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
          <EditableText
            value={content.testimonials.title}
            onChange={(value) => update('testimonials.title', value)}
            editorMode={editorMode}
            placeholder="Section title"
            variant="h2"
            sx={{
              fontSize: { xs: 28, md: 40 },
              display: 'inline-block', pb: 1.5,
              borderBottom: '3px solid', borderColor: 'primary.main',
            }}
          />
          <EditableText
            value={content.testimonials.subtitle}
            onChange={(value) => update('testimonials.subtitle', value)}
            editorMode={editorMode}
            multiline
            placeholder="Section subtitle"
            sx={{ mt: 2, color: 'text.secondary', fontSize: 16 }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3.25, mt: 9, rowGap: 8 }}>
          {content.testimonials.items.map((testimonial, index) => (
            <Card key={index} elevation={0}
              sx={{
                position: 'relative', overflow: 'visible', minHeight: 340,
                display: 'flex', flexDirection: 'column',
                bgcolor: 'brand.surface', border: '1px solid', borderColor: 'brand.line',
                borderRadius: 3.5, px: 3.5, pt: 7, pb: 3.75, textAlign: 'center',
                transition: 'transform .3s ease, box-shadow .3s ease, border-color .3s ease',
                '&:hover': { borderColor: 'transparent', transform: 'translateY(-4px)', boxShadow: '0 22px 44px -18px rgba(0, 0, 0, 0.28)' },
                '&:hover .testimonialAvatar': { transform: 'translateX(-50%) scale(1.04)', filter: 'saturate(1.05) brightness(.92)' },
                '&:hover .testimonialImageButton': { opacity: 1 },
              }}>
              <Avatar
                src={testimonial.avatar}
                alt={testimonial.name}
                className="testimonialAvatar"
                sx={{
                  position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)',
                  width: 74, height: 74, fontWeight: 700, border: '4px solid #fff',
                  background: testimonial.avatar ? '#fff' : 'linear-gradient(150deg, #006600, #032803)',
                  transition: 'transform .3s ease, filter .3s ease',
                  color: testimonial.avatar ? 'transparent' : '#fff',
                }}
              >
                {getInitials(testimonial.name || '?')}
              </Avatar>
              <ImageEditButton
                value={testimonial.avatar}
                onChange={(url) => update(`testimonials.items.${index}.avatar`, url)}
                editorMode={editorMode}
                label="Edit Avatar"
                className="testimonialImageButton"
                sx={{ opacity: 0, top: 8, right: 8, fontSize: 11, px: 1.25 }}
              />
              {editorMode === 'edit' && (
                <DeleteItemButton
                  onDelete={() => removeItem('testimonials.items', index)}
                  sx={{ top: 8, left: 8 }}
                />
              )}

              <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 42, transform: 'scaleX(-1)' }} />
              <EditableText
                value={testimonial.quote}
                onChange={(value) => update(`testimonials.items.${index}.quote`, value)}
                editorMode={editorMode}
                multiline
                placeholder="Testimonial quote"
                sx={{ fontSize: 14.5, color: 'text.secondary', lineHeight: 1.6 }}
              />
              <Box sx={{ mt: 'auto', pt: 2.75 }}>
                <EditableText
                  value={testimonial.name}
                  onChange={(value) => update(`testimonials.items.${index}.name`, value)}
                  editorMode={editorMode}
                  placeholder="Client name"
                  sx={{ fontWeight: 600, color: 'primary.dark' }}
                />
                <EditableText
                  value={testimonial.role}
                  onChange={(value) => update(`testimonials.items.${index}.role`, value)}
                  editorMode={editorMode}
                  placeholder="Client role"
                  sx={{ fontSize: 12.5, color: 'text.secondary', letterSpacing: '.4px' }}
                />
              </Box>
            </Card>
          ))}
        </Box>

        {editorMode === 'edit' && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <AddItemButton
              label="Add testimonial"
              onClick={() => addItem('testimonials.items', {
                quote: 'Share what this client experienced working with HRI.',
                name: 'New Client',
                role: 'Homeowner',
                avatar: '',
              })}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

// Contact call-to-action section.
function CallToAction({ content, editorMode, update }) {
  return (
    <Box component="section" id="contact" sx={{
      position: 'relative', py: { xs: 9, md: 11 }, color: '#fff', overflow: 'hidden', textAlign: 'center',
      background: 'linear-gradient(180deg, #006600 0%, #024A01 55%, #021c02 100%)',
    }}>
      <Box aria-hidden sx={{ position: 'absolute', left: -60, top: -60, width: 220, height: 220, bgcolor: 'rgba(255,255,255,.06)', borderRadius: 2.5, transform: 'rotate(15deg)' }} />
      <Box aria-hidden sx={{ position: 'absolute', right: -70, top: -70, width: 220, height: 220, bgcolor: 'rgba(255,255,255,.06)', borderRadius: 2.5, transform: 'rotate(15deg)' }} />
      <Container sx={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
        <EditableText
          value={content.cta.title}
          onChange={(value) => update('cta.title', value)}
          editorMode={editorMode}
          multiline
          placeholder="CTA title"
          variant="h2"
          sx={{ color: '#fff', textTransform: 'none', fontSize: { xs: 24, md: 36 }, fontWeight: 700 }}
        />
        <EditableText
          value={content.cta.text}
          onChange={(value) => update('cta.text', value)}
          editorMode={editorMode}
          multiline
          placeholder="CTA text"
          sx={{ mt: 2, mb: 3.75, mx: 'auto', maxWidth: 540, fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,.85)' }}
        />
        <Button variant="contained" size="large" disableRipple
          sx={{ bgcolor: '#fff', color: 'primary.dark', '&:hover': { bgcolor: 'transparent', color: '#fff' } }}>
          <EditableText
            value={content.cta.button}
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

// Home page editor. Navbar/Footer come from the shared admin Layout; the
// editor toolbar and content plumbing come from PageEditorShell.
export default function HomePage() {
  return (
    <PageEditorShell
      pageId={HOME_PAGE_ID}
      title="Home Page"
      defaults={homeContentData}
      saveContent={saveHomeContent}
    >
      {(editor) => (
        <Box>
          <Hero {...editor} />
          <FeaturedProjects {...editor} />
          <WhyChooseUs {...editor} />
          <PropertyFeatures {...editor} />
          <Testimonials {...editor} />
          <CallToAction {...editor} />
        </Box>
      )}
    </PageEditorShell>
  )
}
