import { FormEvent, useMemo, useState } from "react"

type Screen = "feed" | "discover" | "match" | "projects" | "profile"
type Post = {
  id: number
  author: string
  role: string
  text: string
  image: string
  likes: number
  liked: boolean
  interested: boolean
  saved: boolean
  comments: string[]
}
type Project = {
  id: number
  title: string
  company: string
  objective: string
  author: string
  area: string
  status: string
  pct: number
  color: string
  collaborators: string[]
  tasks: string[]
}
type Profile = {
  name: string
  role: string
  location: string
  bio: string
  tags: string[]
  photo: string
}

const photos = {
  ana: "https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?auto=format&fit=crop&w=600&q=85",
  team: "https://images.unsplash.com/photo-1568658176307-bfbd2873abda?auto=format&fit=crop&w=900&q=85",
  people:
    "https://images.unsplash.com/photo-1649730828859-73efaff40d04?auto=format&fit=crop&w=900&q=85",
  work: "https://images.unsplash.com/photo-1568658173325-c7b8a11d5666?auto=format&fit=crop&w=900&q=85",
}

const icons: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  folder: <path d="M3 5h6l2 2h10v12H3z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  message: (
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
  ),
  arrow: <path d="m9 18 6-6-6-6" />,
  back: <path d="m15 18-6-6 6-6" />,
  spark: (
    <>
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" />
      <path d="m5 15 .8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8Z" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </>
  ),
}

function Icon({
  name,
  size = 22,
  fill = "none",
}: {
  name: string
  size?: number
  fill?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="tag">{children}</span>
)
function Avatar({
  src,
  name,
  large = false,
}: {
  src: string
  name: string
  large?: boolean
}) {
  return (
    <img
      className={`avatar ${large ? "large" : ""}`}
      src={src}
      alt={`Foto de ${name}`}
    />
  )
}

function Header({
  title,
  eyebrow,
  unread,
  onBell,
  onBack,
}: {
  title: string
  eyebrow: string
  unread: boolean
  onBell: () => void
  onBack?: () => void
}) {
  return (
    <header className="header">
      <div>
        {onBack && (
          <button
            className="icon-btn back"
            onClick={onBack}
            aria-label="Voltar"
          >
            <Icon name="back" />
          </button>
        )}
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      <button
        className="icon-btn notification"
        onClick={onBell}
        aria-label="Abrir notificações"
      >
        <Icon name="bell" />
        {unread && <i />}
      </button>
    </header>
  )
}

function Modal({
  title,
  children,
  close,
  sheet = false,
}: {
  title: string
  children: React.ReactNode
  close: () => void
  sheet?: boolean
}) {
  return (
    <div className="overlay" onMouseDown={close}>
      <section
        className={`modal ${sheet ? "sheet" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={close} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

function Notifications({
  close,
  read,
  markRead,
}: {
  close: () => void
  read: boolean
  markRead: () => void
}) {
  const alerts = [
    "Rafael Souza aceitou sua conexão",
    "Novo comentário no projeto Mapa Afetivo",
    "Marina Costa convidou você para um grupo",
  ]
  return (
    <Modal title="Notificações" close={close}>
      <div className="notification-list">
        {alerts.map((a, i) => (
          <div className={`notice ${read ? "" : "unread"}`} key={a}>
            <span>{i === 0 ? "RS" : i === 1 ? "MA" : "MC"}</span>
            <div>
              <strong>{a}</strong>
              <small>{i + 1}h atrás</small>
            </div>
          </div>
        ))}
      </div>
      <button className="primary-btn" onClick={markRead}>
        {read ? "Tudo em dia" : "Marcar todas como lidas"}
      </button>
    </Modal>
  )
}

function PostCard({
  post,
  update,
  comment,
}: {
  post: Post
  update: (p: Post) => void
  comment: () => void
}) {
  return (
    <article className="post card">
      <div className="post-head">
        <div className="initial small">
          {post.author
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <strong>{post.author}</strong>
          <span>{post.role} · há 2h</span>
        </div>
        <button
          className={`save-post ${post.saved ? "saved" : ""}`}
          onClick={() => update({ ...post, saved: !post.saved })}
          aria-label={post.saved ? "Remover dos salvos" : "Salvar publicação"}
        >
          <Icon name="bookmark" fill={post.saved ? "currentColor" : "none"} />
        </button>
      </div>
      <p>{post.text}</p>
      <img className="cover" src={post.image} alt="Imagem da publicação" />
      <div className="post-actions">
        <button
          className={post.liked ? "liked" : ""}
          onClick={() =>
            update({
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            })
          }
        >
          <Icon name="heart" fill={post.liked ? "currentColor" : "none"} />{" "}
          {post.likes}
        </button>
        <button onClick={comment}>
          <Icon name="message" /> {post.comments.length} comentários
        </button>
        <button
          className={`interest ${post.interested ? "sent" : ""}`}
          onClick={() => update({ ...post, interested: !post.interested })}
        >
          {post.interested ? "Interesse enviado ✓" : "Tenho interesse"}
        </button>
      </div>
    </article>
  )
}

function Feed({
  profile,
  posts,
  setPosts,
  common,
}: {
  profile: Profile
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  common: CommonProps
}) {
  const [expanded, setExpanded] = useState(false)
  const [commentId, setCommentId] = useState<number | null>(null)
  const [text, setText] = useState("")
  const current = posts.find((p) => p.id === commentId)
  const update = (next: Post) =>
    setPosts((ps) => ps.map((p) => (p.id === next.id ? next : p)))
  const publish = (e: FormEvent) => {
    e.preventDefault()
    if (text.trim() && current) {
      update({ ...current, comments: [...current.comments, text.trim()] })
      setText("")
    }
  }
  return (
    <>
      <Header
        title={`Bom dia, ${profile.name.split(" ")[0]}`}
        eyebrow="SEGUNDA, 24 JUN"
        {...common}
      />
      <section className="content">
        <div className="progress-card">
          <div>
            <span className="eyebrow light">SEU PROGRESSO</span>
            <h2>Continue em movimento</h2>
            <p>Você está a 2 conexões da sua meta semanal.</p>
          </div>
          <div className="progress-ring">
            <strong>60%</strong>
          </div>
        </div>
        <div className="section-title">
          <h2>Para você</h2>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Mostrar menos" : "Ver tudo"}
          </button>
        </div>
        <div className="feed-list">
          {posts.slice(0, expanded ? posts.length : 1).map((p) => (
            <PostCard
              key={p.id}
              post={p}
              update={update}
              comment={() => setCommentId(p.id)}
            />
          ))}
        </div>
      </section>
      {current && (
        <Modal title="Comentários" close={() => setCommentId(null)} sheet>
          <div className="comments">
            {current.comments.map((c, i) => (
              <div className="comment" key={i}>
                <span>AB</span>
                <p>{c}</p>
              </div>
            ))}
          </div>
          <form className="composer" onSubmit={publish}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva um comentário..."
              autoFocus
            />
            <button>Publicar</button>
          </form>
        </Modal>
      )}
    </>
  )
}

const discoverItems = [
  {
    name: "Marina Costa",
    role: "UX Research",
    area: "Pesquisa",
    type: "Pessoas",
    initials: "MC",
  },
  {
    name: "Lucas Lima",
    role: "Desenvolvedor",
    area: "Tecnologia",
    type: "Pessoas",
    initials: "LL",
  },
  {
    name: "João Vitor",
    role: "Estrategista",
    area: "Impacto social",
    type: "Pessoas",
    initials: "JV",
  },
  {
    name: "Rede Criativa",
    role: "Comunidade",
    area: "Design",
    type: "Grupos",
    initials: "RC",
  },
  {
    name: "Cidade Viva",
    role: "Projeto aberto",
    area: "Urbanismo",
    type: "Projetos",
    initials: "CV",
  },
]
function Discover({
  goFeed,
  common,
}: {
  goFeed: () => void
  common: CommonProps
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("Para você")
  const [connected, setConnected] = useState<string[]>([])
  const filtered = discoverItems.filter(
    (i) =>
      (filter === "Para você" || i.type === filter) &&
      `${i.name} ${i.role} ${i.area}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  return (
    <>
      <Header title="Descobrir" eyebrow="EXPLORE POSSIBILIDADES" {...common} />
      <section className="content">
        <div className="searchbox">
          <Icon name="search" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar"
            placeholder="Pessoas, projetos ou habilidades"
          />
        </div>
        <div className="chips">
          {["Para você", "Pessoas", "Projetos", "Grupos"].map((x) => (
            <button
              className={filter === x ? "active" : ""}
              onClick={() => setFilter(x)}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
        {!query && filter === "Para você" && (
          <div className="feature">
            <img src={photos.people} alt="Comunidade criativa" />
            <div className="feature-copy">
              <Tag>EM DESTAQUE</Tag>
              <h2>Ideias crescem quando são compartilhadas.</h2>
              <p>Conheça a comunidade de inovação social.</p>
              <button className="white-btn" onClick={goFeed}>
                Explorar comunidade
              </button>
            </div>
          </div>
        )}
        <div className="section-title">
          <h2>{query ? "Resultados" : "Talentos para conhecer"}</h2>
          <span>{filtered.length} encontrados</span>
        </div>
        <div className="discover-grid">
          {filtered.map((i) => (
            <article className="person card" key={i.name}>
              <div className="initial">{i.initials}</div>
              <strong>{i.name}</strong>
              <span>
                {i.role} · {i.area}
              </span>
              <button
                className={connected.includes(i.name) ? "connected" : ""}
                onClick={() =>
                  setConnected((c) =>
                    c.includes(i.name)
                      ? c.filter((x) => x !== i.name)
                      : [...c, i.name],
                  )
                }
              >
                {connected.includes(i.name)
                  ? "Conectado ✓"
                  : i.type === "Pessoas"
                    ? "Conectar"
                    : "Explorar"}
              </button>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty">
            <Icon name="search" />
            <strong>Nenhum resultado</strong>
            <span>Tente outro termo ou filtro.</span>
          </div>
        )}
      </section>
    </>
  )
}

const matches = [
  {
    name: "Rafael Souza",
    age: 29,
    city: "São Paulo · SP",
    role: "Desenvolvedor full-stack criando produtos que aproximam pessoas.",
    score: 94,
    initials: "RS",
    tags: ["React", "Impacto social", "Fintech"],
    area: "Tecnologia",
  },
  {
    name: "Bianca Alves",
    age: 27,
    city: "Recife · PE",
    role: "Pesquisadora e estrategista de produtos inclusivos.",
    score: 91,
    initials: "BA",
    tags: ["Pesquisa", "Acessibilidade", "Educação"],
    area: "Design",
  },
  {
    name: "Pedro Martins",
    age: 31,
    city: "Belo Horizonte · MG",
    role: "Empreendedor focado em economia circular.",
    score: 89,
    initials: "PM",
    tags: ["Negócios", "Circular", "Dados"],
    area: "Impacto Social",
  },
  {
    name: "Juliana Rocha",
    age: 26,
    city: "Curitiba · PR",
    role: "UX Writer e facilitadora de comunidades.",
    score: 87,
    initials: "JR",
    tags: ["Conteúdo", "Comunidades", "UX"],
    area: "Design",
  },
  {
    name: "Diego Nunes",
    age: 30,
    city: "Salvador · BA",
    role: "Engenheiro mobile construindo soluções cívicas.",
    score: 85,
    initials: "DN",
    tags: ["Mobile", "Cidades", "Open source"],
    area: "Tecnologia",
  },
]
function Match({
  common,
  profile,
  chats,
  setChats,
  onConnected,
}: {
  common: CommonProps
  profile: Profile
  chats: Record<string, string[]>
  setChats: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  onConnected: () => void
}) {
  const [index, setIndex] = useState(0)
  const [chat, setChat] = useState(false)
  const [message, setMessage] = useState("")
  const [quote, setQuote] = useState(0)
  const [filter, setFilter] = useState("Todos")
  const [showFilters, setShowFilters] = useState(false)
  const [celebration, setCelebration] = useState<typeof matches[number] | null>(
    null,
  )
  const queue = matches.filter((m) => filter === "Todos" || m.area === filter)
  const person = queue[index % queue.length]
  const next = () => setIndex((i) => (i + 1) % queue.length)
  const connect = () => {
    setCelebration(person)
    onConnected()
  }
  const quotes = [
    '"Consegui meu co-founder de UX por aqui!" — Camila M.',
    '"Meu primeiro projeto colaborativo nasceu aqui." — André P.',
    '"Matches muito mais relevantes." — Livia R.',
  ]
  return (
    <>
      <Header title="Matchmaking" eyebrow="CONEXÕES INTELIGENTES" {...common} />
      <section className="content match-content">
        <div className="match-toolbar">
          <button onClick={() => setShowFilters(!showFilters)}>
            <Icon name="filter" size={16} />
            {filter}
          </button>
          <span>{queue.length} perfis</span>
        </div>
        {showFilters && (
          <div className="chips match-filters">
            {["Todos", "Tecnologia", "Design", "Impacto Social"].map((x) => (
              <button
                key={x}
                className={filter === x ? "active" : ""}
                onClick={() => {
                  setFilter(x)
                  setIndex(0)
                  setShowFilters(false)
                }}
              >
                {x}
              </button>
            ))}
          </div>
        )}
        <div className="match-score">
          <Icon name="spark" />
          <span>{person.score}% de compatibilidade</span>
        </div>
        <article className="match-card">
          <div className="match-portrait">
            <span>{person.initials}</span>
            <div className="online" />
          </div>
          <div className="match-info">
            <span className="eyebrow">{person.city}</span>
            <h2>
              {person.name}, {person.age}
            </h2>
            <p>{person.role}</p>
            <div className="tag-row">
              {person.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <div className="common">
              <span>Em comum</span>
              <strong>4 interesses · 2 conexões</strong>
            </div>
          </div>
        </article>
        <div className="match-actions">
          <button
            className="round secondary"
            onClick={next}
            aria-label="Pular perfil"
          >
            ×
          </button>
          <button className="connect-btn" onClick={connect}>
            <Icon name="users" />
            Quero conectar
          </button>
          <button
            className="round"
            onClick={() => setChat(true)}
            aria-label="Conversar"
          >
            <Icon name="message" />
          </button>
        </div>
        <button
          className="testimonial"
          onClick={() => setQuote((quote + 1) % quotes.length)}
        >
          {quotes[quote]} <small>Toque para ver outro relato</small>
        </button>
      </section>
      {chat && (
        <Modal
          title={`Mensagem para ${person.name}`}
          close={() => setChat(false)}
          sheet
        >
          <div className="quick-messages">
            {(chats[person.name] || []).map((m, i) => (
              <p key={i}>{m}</p>
            ))}
            {(chats[person.name] || []).length === 0 && (
              <span>Comece uma conversa apresentando sua ideia.</span>
            )}
          </div>
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault()
              if (message.trim()) {
                setChats((all) => ({
                  ...all,
                  [person.name]: [...(all[person.name] || []), message.trim()],
                }))
                setMessage("")
              }
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Olá! Vi que temos interesses em comum..."
            />
            <button>Enviar</button>
          </form>
        </Modal>
      )}
      {celebration && (
        <Modal
          title="Conexão realizada!"
          close={() => {
            setCelebration(null)
            next()
          }}
        >
          <div className="celebration">
            <div className="connection-faces">
              <Avatar src={profile.photo} name={profile.name} large />
              <span>✓</span>
              <img
                className="match-face"
                src={photos.people}
                alt={`Foto de ${celebration.name}`}
              />
            </div>
            <h3>Você e {celebration.name} agora podem criar algo incrível.</h3>
            <p>Que tal começar a conversa apresentando sua ideia?</p>
            <button
              className="primary-btn"
              onClick={() => {
                setCelebration(null)
                setChat(true)
              }}
            >
              Mandar mensagem agora
            </button>
            <button
              className="secondary-btn"
              onClick={() => {
                setCelebration(null)
                next()
              }}
            >
              Continuar explorando
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: "Mapa Afetivo",
    company: "Instituto Cidade",
    objective: "Preservar memórias e vínculos dos bairros de São Paulo.",
    author: "Ana Beatriz",
    area: "Cultura & cidade",
    status: "Em andamento",
    pct: 72,
    color: "violet",
    collaborators: ["Ana Beatriz", "Rafael Souza", "Marina Costa"],
    tasks: ["Validar protótipo", "Entrevistar moradores", "Publicar mapa beta"],
  },
  {
    id: 2,
    title: "Viva Bairro",
    company: "Coletivo Local",
    objective: "Conectar moradores a serviços e iniciativas locais.",
    author: "Ana Beatriz",
    area: "Impacto social",
    status: "Recrutando",
    pct: 38,
    color: "blue",
    collaborators: ["Ana Beatriz", "João Vitor"],
    tasks: ["Definir parceiros", "Criar identidade"],
  },
  {
    id: 3,
    title: "Reuso Lab",
    company: "Circular Hub",
    objective: "Estimular novos hábitos de consumo e reuso.",
    author: "Ana Beatriz",
    area: "Economia circular",
    status: "Ideação",
    pct: 18,
    color: "green",
    collaborators: ["Ana Beatriz"],
    tasks: ["Mapear oportunidades", "Planejar pesquisa"],
  },
]
function ProjectForm({
  close,
  save,
}: {
  close: () => void
  save: (p: Project) => void
}) {
  const [data, setData] = useState({
    title: "",
    company: "",
    objective: "",
    author: "",
    area: "Design",
    status: "Ideação",
  })
  const field = (key: keyof typeof data, label: string, area = false) => (
    <label>
      {label}
      {area ? (
        <textarea
          required
          value={data[key]}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
        />
      ) : (
        <input
          required
          value={data[key]}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
        />
      )}
    </label>
  )
  return (
    <Modal title="Novo projeto" close={close}>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          save({
            id: Date.now(),
            ...data,
            pct: 0,
            color: "violet",
            collaborators: [data.author],
            tasks: ["Definir primeira entrega"],
          })
        }}
      >
        {field("title", "Nome do projeto")}
        {field("company", "Empresa / organização")}
        {field("objective", "Objetivo do projeto", true)}
        {field("author", "Autor / responsável")}
        <div className="form-row">
          <label>
            Categoria
            <select
              value={data.area}
              onChange={(e) => setData({ ...data, area: e.target.value })}
            >
              <option>Design</option>
              <option>Impacto social</option>
              <option>Tecnologia</option>
            </select>
          </label>
          <label>
            Status
            <select
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
            >
              <option>Ideação</option>
              <option>Recrutando</option>
              <option>Em andamento</option>
            </select>
          </label>
        </div>
        <button className="primary-btn">Salvar projeto</button>
      </form>
    </Modal>
  )
}
function ProjectDetails({
  project,
  close,
  update,
  connections,
}: {
  project: Project
  close: () => void
  update: (p: Project) => void
  connections: string[]
}) {
  const [inviting, setInviting] = useState(false)
  return (
    <div className="detail-page">
      <Header
        title={project.title}
        eyebrow={project.status.toUpperCase()}
        unread={false}
        onBell={() => {}}
        onBack={close}
      />
      <section className="content">
        <div className="detail-hero">
          <div className={`project-mark ${project.color}`}>
            <Icon name="folder" />
          </div>
          <p>{project.objective}</p>
          <span>
            {project.company} · por {project.author}
          </span>
        </div>
        <div className="detail-section">
          <div className="section-title">
            <h2>Progresso</h2>
            <strong>{project.pct}%</strong>
          </div>
          <input
            className="range"
            type="range"
            min="0"
            max="100"
            value={project.pct}
            onChange={(e) =>
              update({ ...project, pct: Number(e.target.value) })
            }
          />
        </div>
        <div className="detail-section">
          <div className="section-title">
            <h2>Colaboradores</h2>
            <button onClick={() => setInviting(true)}>+ Convidar membro</button>
          </div>
          <div className="avatar-stack">
            {project.collaborators.map((x) => (
              <span key={x} title={x}>
                {x
                  .split(" ")
                  .map((y) => y[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            ))}
          </div>
        </div>
        <div className="detail-section">
          <h2>Tarefas e entregas</h2>
          {project.tasks.map((t, i) => (
            <label className="task" key={t}>
              <input type="checkbox" defaultChecked={i === 0} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </section>
      {inviting && (
        <Modal title="Convidar conexão" close={() => setInviting(false)} sheet>
          <div className="invite-list">
            {connections.map((name) => (
              <button
                key={name}
                disabled={project.collaborators.includes(name)}
                onClick={() => {
                  update({
                    ...project,
                    collaborators: [...project.collaborators, name],
                  })
                  setInviting(false)
                }}
              >
                <span>
                  {name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <strong>{name}</strong>
                  <small>
                    {project.collaborators.includes(name)
                      ? "Já participa"
                      : "Adicionar ao projeto"}
                  </small>
                </div>
                <b>{project.collaborators.includes(name) ? "✓" : "+"}</b>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
function Projects({
  common,
  projects,
  setProjects,
  toast,
  connections,
}: {
  common: CommonProps
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  toast: (s: string) => void
  connections: string[]
}) {
  const [form, setForm] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [organizing, setOrganizing] = useState(false)
  const [statusFilter, setStatusFilter] = useState("Todos")
  const project = projects.find((p) => p.id === selected)
  if (project)
    return (
      <ProjectDetails
        project={project}
        close={() => setSelected(null)}
        update={(next) =>
          setProjects((ps) => ps.map((p) => (p.id === next.id ? next : p)))
        }
        connections={connections}
      />
    )
  return (
    <>
      <Header title="Meus projetos" eyebrow="TRANSFORME IDEIAS" {...common} />
      <section className="content">
        <button className="new-project" onClick={() => setForm(true)}>
          <span>
            <Icon name="plus" />
          </span>
          <div>
            <strong>Criar novo projeto</strong>
            <small>Comece do zero ou use um modelo</small>
          </div>
          <Icon name="arrow" />
        </button>
        <div className="summary">
          <div>
            <strong>{projects.length}</strong>
            <span>Ativos</span>
          </div>
          <div>
            <strong>
              {projects.reduce((n, p) => n + p.collaborators.length, 0)}
            </strong>
            <span>Colaboradores</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Entregas este mês</span>
          </div>
        </div>
        <div className="section-title">
          <h2>Seus projetos</h2>
          <button onClick={() => setOrganizing(!organizing)}>Organizar</button>
        </div>
        {organizing && (
          <div className="chips organize-chips">
            {["Todos", "Em andamento", "Recrutando", "Ideação"].map((x) => (
              <button
                key={x}
                className={statusFilter === x ? "active" : ""}
                onClick={() => setStatusFilter(x)}
              >
                {x}
              </button>
            ))}
          </div>
        )}
        <div className="project-list">
          {projects
            .filter(
              (p) => statusFilter === "Todos" || p.status === statusFilter,
            )
            .map((p) => (
              <div className="project-wrap" key={p.id}>
                <button
                  className="project card"
                  onClick={() => setSelected(p.id)}
                >
                  <div className={`project-mark ${p.color}`}>
                    <Icon name="folder" />
                  </div>
                  <div className="project-main">
                    <div>
                      <Tag>{p.status}</Tag>
                      <span>{p.area}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <div className="bar">
                      <i style={{ width: `${p.pct}%` }} />
                    </div>
                    <small>{p.pct}% concluído</small>
                  </div>
                  <Icon name="arrow" />
                </button>
                {organizing && p.id > 3 && (
                  <button
                    className="archive-btn"
                    onClick={() => {
                      setProjects((ps) => ps.filter((x) => x.id !== p.id))
                      toast("Projeto arquivado")
                    }}
                  >
                    Arquivar
                  </button>
                )}
              </div>
            ))}
        </div>
      </section>
      {form && (
        <ProjectForm
          close={() => setForm(false)}
          save={(p) => {
            setProjects((ps) => [p, ...ps])
            setForm(false)
            toast("Projeto criado com sucesso!")
          }}
        />
      )}
    </>
  )
}

function ProfileEdit({
  profile,
  close,
  save,
}: {
  profile: Profile
  close: () => void
  save: (p: Profile) => void
}) {
  const [data, setData] = useState(profile)
  const [skill, setSkill] = useState("")
  return (
    <Modal title="Editar perfil" close={close}>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          save(data)
          close()
        }}
      >
        <label>
          Nome
          <input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
        <label>
          Cargo
          <input
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
          />
        </label>
        <label>
          Localização
          <input
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
          />
        </label>
        <label>
          Sobre mim
          <textarea
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
          />
        </label>
        <label>
          Habilidades
          <div className="tag-editor">
            {data.tags.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() =>
                  setData({ ...data, tags: data.tags.filter((x) => x !== t) })
                }
              >
                {t} ×
              </button>
            ))}
          </div>
          <div className="inline-input">
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Nova habilidade"
            />
            <button
              type="button"
              onClick={() => {
                if (skill.trim()) {
                  setData({ ...data, tags: [...data.tags, skill.trim()] })
                  setSkill("")
                }
              }}
            >
              Adicionar
            </button>
          </div>
        </label>
        <button className="primary-btn">Salvar alterações</button>
      </form>
    </Modal>
  )
}
function ProfileView({
  common,
  profile,
  setProfile,
  goProjects,
  posts,
  availability,
  setAvailability,
  dark,
  setDark,
  connectionCount,
  projectsCount,
}: {
  common: CommonProps
  profile: Profile
  setProfile: (p: Profile) => void
  goProjects: () => void
  posts: Post[]
  availability: string
  setAvailability: (s: string) => void
  dark: boolean
  setDark: (v: boolean) => void
  connectionCount: number
  projectsCount: number
}) {
  const [edit, setEdit] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  return (
    <>
      <Header title="Perfil" eyebrow="SUA JORNADA" {...common} />
      <section className="content">
        <div className="profile-tools">
          <button onClick={() => setDark(!dark)}>
            <Icon name={dark ? "sun" : "moon"} size={16} />
            {dark ? "Tema claro" : "Tema escuro"}
          </button>
        </div>
        <div className="profile-hero">
          <button className="profile-avatar" onClick={() => setLightbox(true)}>
            <Avatar src={profile.photo} name={profile.name} large />
            <span
              onClick={(e) => {
                e.stopPropagation()
                const options = [
                  "Disponível para projetos",
                  "Buscando co-founder",
                  "Focado em entregas",
                ]
                setAvailability(
                  options[(options.indexOf(availability) + 1) % options.length],
                )
              }}
            />
          </button>
          <h2>{profile.name}</h2>
          <p>
            {profile.role} · {profile.location}
          </p>
          <button
            className="availability"
            onClick={() => {
              const options = [
                "Disponível para projetos",
                "Buscando co-founder",
                "Focado em entregas",
              ]
              setAvailability(
                options[(options.indexOf(availability) + 1) % options.length],
              )
            }}
          >
            {availability}
          </button>
          <div className="profile-stats">
            <div>
              <strong>128</strong>
              <span>Conexões</span>
            </div>
            <div>
              <strong>14</strong>
              <span>Projetos</span>
            </div>
            <div>
              <strong>8</strong>
              <span>Mentorias</span>
            </div>
          </div>
          <button className="outline-btn" onClick={() => setEdit(true)}>
            Editar perfil
          </button>
        </div>
        <div className="section-title">
          <h2>Conquistas</h2>
          <span>
            {
              [
                projectsCount > 3,
                connectionCount > 0,
                posts.some((p) => p.liked),
              ].filter(Boolean).length
            }
            /3 desbloqueadas
          </span>
        </div>
        <div className="badges">
          <div className={projectsCount > 3 ? "unlocked" : ""}>
            <b>◆</b>
            <span>Primeiro Projeto</span>
          </div>
          <div className={connectionCount > 0 ? "unlocked" : ""}>
            <b>✦</b>
            <span>Super Conector</span>
          </div>
          <div className={posts.some((p) => p.liked) ? "unlocked" : ""}>
            <b>●</b>
            <span>Inovador</span>
          </div>
        </div>
        <button className="portfolio-call" onClick={goProjects}>
          <div>
            <span className="eyebrow light">PORTFÓLIO</span>
            <h2>Veja meus trabalhos</h2>
            <p>Projetos e cases selecionados</p>
          </div>
          <span className="icon-btn">
            <Icon name="arrow" />
          </span>
        </button>
        <div className="section-title">
          <h2>Sobre mim</h2>
          <button onClick={() => setEdit(true)}>Editar</button>
        </div>
        <p className="bio">{profile.bio}</p>
        <div className="tag-row">
          {profile.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="section-title">
          <h2>Posts salvos</h2>
          <span>{posts.filter((p) => p.saved).length}</span>
        </div>
        <div className="saved-posts">
          {posts
            .filter((p) => p.saved)
            .map((p) => (
              <article key={p.id}>
                <img src={p.image} alt="" />
                <div>
                  <strong>{p.author}</strong>
                  <p>{p.text}</p>
                </div>
              </article>
            ))}
          {!posts.some((p) => p.saved) && (
            <div className="empty-saved">
              <Icon name="bookmark" />
              <span>Seus posts salvos aparecerão aqui.</span>
            </div>
          )}
        </div>
      </section>
      {edit && (
        <ProfileEdit
          profile={profile}
          close={() => setEdit(false)}
          save={setProfile}
        />
      )}
      {lightbox && (
        <Modal title="Foto de perfil" close={() => setLightbox(false)}>
          <div className="photo-view">
            <img src={profile.photo} alt={profile.name} />
            <button
              className="primary-btn"
              onClick={() =>
                setProfile({
                  ...profile,
                  photo:
                    profile.photo === photos.ana ? photos.people : photos.ana,
                })
              }
            >
              Simular nova foto
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

type CommonProps = { unread: boolean onBell: () => void }
const nav: { id: Screen label: string icon: string }[] = [
  { id: "feed", label: "Início", icon: "home" },
  { id: "discover", label: "Descobrir", icon: "search" },
  { id: "match", label: "Matches", icon: "users" },
  { id: "projects", label: "Projetos", icon: "folder" },
  { id: "profile", label: "Perfil", icon: "user" },
]

export default function App() {
  const [screen, setScreen] = useState<Screen>("feed")
  const [notifications, setNotifications] = useState(false)
  const [read, setRead] = useState(false)
  const [toast, setToast] = useState("")
  const [dark, setDark] = useState(false)
  const [availability, setAvailability] = useState("Disponível para projetos")
  const [connectionCount, setConnectionCount] = useState(0)
  const [chats, setChats] = useState<Record<string, string[]>>({})
  const [profile, setProfile] = useState<Profile>({
    name: "Ana Beatriz",
    role: "Product Designer",
    location: "São Paulo, SP",
    bio: "Transformo problemas complexos em experiências simples. Acredito no design como ferramenta de impacto positivo.",
    tags: ["Design de produto", "Pesquisa", "Estratégia"],
    photo: photos.ana,
  })
  const [projects, setProjects] = useState(initialProjects)
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Ana Beatriz",
      role: "Product Designer",
      text: "Depois de semanas de pesquisa, nosso novo projeto de impacto local ganhou forma. Busco pessoas de tecnologia para colaborar.",
      image: photos.team,
      likes: 24,
      liked: false,
      interested: false,
      saved: false,
      comments: ["Que iniciativa incrível!", "Posso ajudar com a pesquisa."],
    },
    {
      id: 2,
      author: "Marina Costa",
      role: "UX Researcher",
      text: "Compartilhei um guia prático para conduzir entrevistas mais inclusivas com comunidades locais.",
      image: photos.people,
      likes: 41,
      liked: false,
      interested: false,
      saved: false,
      comments: ["Material muito útil!"],
    },
    {
      id: 3,
      author: "Lucas Lima",
      role: "Desenvolvedor",
      text: "Abrimos três vagas voluntárias para construir uma plataforma cívica open source.",
      image: photos.work,
      likes: 18,
      liked: false,
      interested: false,
      saved: false,
      comments: ["Tenho interesse em participar."],
    },
  ])
  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2200)
  }
  const common = useMemo(
    () => ({ unread: !read, onBell: () => setNotifications(true) }),
    [read],
  )
  return (
    <main className="app-shell">
      <div className={`phone ${dark ? "dark" : ""}`}>
        <div className="status">
          <span>9:41</span>
          <div>
            <i />
            <i />
            <b />
          </div>
        </div>
        <div className="screen tab-transition" key={screen}>
          {screen === "feed" && (
            <Feed
              profile={profile}
              posts={posts}
              setPosts={setPosts}
              common={common}
            />
          )}
          {screen === "discover" && (
            <Discover goFeed={() => setScreen("feed")} common={common} />
          )}
          {screen === "match" && (
            <Match
              common={common}
              profile={profile}
              chats={chats}
              setChats={setChats}
              onConnected={() => setConnectionCount((n) => n + 1)}
            />
          )}
          {screen === "projects" && (
            <Projects
              common={common}
              projects={projects}
              setProjects={setProjects}
              toast={showToast}
              connections={[
                "Marina Costa",
                "Rafael Souza",
                "Lucas Lima",
                "João Vitor",
              ]}
            />
          )}
          {screen === "profile" && (
            <ProfileView
              common={common}
              profile={profile}
              setProfile={setProfile}
              goProjects={() => setScreen("projects")}
              posts={posts}
              availability={availability}
              setAvailability={setAvailability}
              dark={dark}
              setDark={setDark}
              connectionCount={connectionCount}
              projectsCount={projects.length}
            />
          )}
        </div>
        <nav className="bottom-nav">
          {nav.map((n) => (
            <button
              key={n.id}
              className={screen === n.id ? "active" : ""}
              onClick={() => setScreen(n.id)}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {screen === n.id && <i />}
            </button>
          ))}
        </nav>
        {notifications && (
          <Notifications
            close={() => setNotifications(false)}
            read={read}
            markRead={() => setRead(true)}
          />
        )}
        {toast && (
          <div className="toast">
            <span>✓</span>
            {toast}
          </div>
        )}
      </div>
    </main>
  )
}
