"use client"

import { useState, useEffect } from 'react'
import { Phone, Mail, Instagram, Facebook, Wifi, Car, Truck, MapPin, Star, ShoppingCart, Settings, Lock, Plus, Edit, Trash2, Save, Eye, EyeOff, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Configurações do sistema (em produção, viriam de um banco de dados)
const initialConfig = {
  whatsappNumber: "5511999999999",
  whatsappMessage: "Olá! Tenho interesse no produto {PRODUTO}. Pode me ajudar com mais informações?",
  contactMessage: "Olá! Gostaria de mais informações sobre os serviços da CarConnect.",
  email: "contato@carconnect.com.br",
  instagram: "https://instagram.com/carconnect",
  facebook: "https://facebook.com/carconnect",
  adminPassword: "admin123" // Em produção, seria hash criptografado
}

// Dados dos produtos (em produção, viriam de um banco de dados)
const initialProducts = [
  {
    id: 1,
    name: "Starlink Mini",
    description: "Internet via satélite portátil, ideal para viagens e locais remotos. Velocidade de até 100 Mbps.",
    price: "R$ 2.499,00",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    category: "Starlink"
  },
  {
    id: 2,
    name: "Instalação Starlink Motorhome",
    description: "Serviço completo de instalação do Starlink em motorhomes e trailers. Inclui suporte e configuração.",
    price: "R$ 899,00",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
    category: "Serviços"
  },
  {
    id: 3,
    name: "Kit de Viagem Starlink",
    description: "Kit completo com case protetor, cabos extras e suporte portátil para uso em viagens.",
    price: "R$ 459,00",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    category: "Acessórios"
  },
  {
    id: 4,
    name: "Inversor de Energia 12V",
    description: "Inversor de energia 12V para 220V, ideal para alimentar equipamentos em veículos.",
    price: "R$ 299,00",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    category: "Automotivo"
  },
  {
    id: 5,
    name: "Suporte Veicular Starlink",
    description: "Suporte magnético para fixação do Starlink no teto de veículos. Instalação rápida e segura.",
    price: "R$ 189,00",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    category: "Acessórios"
  },
  {
    id: 6,
    name: "Consultoria Técnica",
    description: "Consultoria especializada para escolha da melhor solução de internet via satélite para seu negócio.",
    price: "R$ 199,00",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    category: "Serviços"
  }
]

export default function CarConnectApp() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [products, setProducts] = useState(initialProducts)
  const [config, setConfig] = useState(initialConfig)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')
  const [adminMessageType, setAdminMessageType] = useState('success')

  // Carregar dados do localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('carconnect_products')
    const savedConfig = localStorage.getItem('carconnect_config')
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  // Salvar dados no localStorage
  const saveData = () => {
    localStorage.setItem('carconnect_products', JSON.stringify(products))
    localStorage.setItem('carconnect_config', JSON.stringify(config))
  }

  const handleAdminLogin = () => {
    if (adminPassword === config.adminPassword) {
      setIsAdminAuthenticated(true)
      setAdminPassword('')
      setAdminMessage('Login realizado com sucesso!')
      setAdminMessageType('success')
      setTimeout(() => setAdminMessage(''), 3000)
    } else {
      setAdminMessage('Senha incorreta!')
      setAdminMessageType('error')
      setTimeout(() => setAdminMessage(''), 3000)
    }
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    setActiveTab('inicio')
  }

  const handleWhatsAppOrder = (productName) => {
    const message = config.whatsappMessage.replace('{PRODUTO}', productName)
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleWhatsAppContact = () => {
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.contactMessage)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Editar produto existente
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p))
      setAdminMessage('Produto atualizado com sucesso!')
    } else {
      // Adicionar novo produto
      const newProduct = { ...productData, id: Date.now() }
      setProducts([...products, newProduct])
      setAdminMessage('Produto adicionado com sucesso!')
    }
    
    setEditingProduct(null)
    setIsAddingProduct(false)
    setAdminMessageType('success')
    setTimeout(() => setAdminMessage(''), 3000)
    saveData()
  }

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId))
    setAdminMessage('Produto excluído com sucesso!')
    setAdminMessageType('success')
    setTimeout(() => setAdminMessage(''), 3000)
    saveData()
  }

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig)
    setAdminMessage('Configurações salvas com sucesso!')
    setAdminMessageType('success')
    setTimeout(() => setAdminMessage(''), 3000)
    saveData()
  }

  const renderAdminLogin = () => (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader className="text-center">
          <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <CardTitle>Acesso Administrativo</CardTitle>
          <CardDescription>Digite a senha para acessar o painel administrativo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminMessage && (
            <Alert className={adminMessageType === 'error' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
              <AlertDescription>{adminMessage}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="Digite a senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAdminLogin} className="w-full">
            <Lock className="w-4 h-4 mr-2" />
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )

  const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      image: product?.image || '',
      category: product?.category || ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{product ? 'Editar Produto' : 'Adicionar Produto'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="R$ 0,00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://..."
                required
              />
              {formData.image && (
                <div className="mt-2">
                  <img src={formData.image} alt="Preview" className="w-32 h-24 object-cover rounded" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  const ConfigForm = () => {
    const [configData, setConfigData] = useState(config)

    const handleSubmit = (e) => {
      e.preventDefault()
      handleSaveConfig(configData)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>Gerencie as configurações gerais do aplicativo</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">WhatsApp</h4>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={configData.whatsappNumber}
                  onChange={(e) => setConfigData({...configData, whatsappNumber: e.target.value})}
                  placeholder="5511999999999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappMessage">Mensagem Automática dos Produtos</Label>
                <Textarea
                  id="whatsappMessage"
                  value={configData.whatsappMessage}
                  onChange={(e) => setConfigData({...configData, whatsappMessage: e.target.value})}
                  rows={2}
                  placeholder="Use {PRODUTO} para inserir o nome do produto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactMessage">Mensagem de Contato Geral</Label>
                <Textarea
                  id="contactMessage"
                  value={configData.contactMessage}
                  onChange={(e) => setConfigData({...configData, contactMessage: e.target.value})}
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Contatos</h4>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={configData.email}
                  onChange={(e) => setConfigData({...configData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={configData.instagram}
                  onChange={(e) => setConfigData({...configData, instagram: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={configData.facebook}
                  onChange={(e) => setConfigData({...configData, facebook: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Segurança</h4>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Senha do Administrador</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={configData.adminPassword}
                  onChange={(e) => setConfigData({...configData, adminPassword: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  const renderAdminPanel = () => {
    if (isAddingProduct || editingProduct) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
            <Button variant="outline" onClick={handleAdminLogout}>
              Sair
            </Button>
          </div>
          
          {adminMessage && (
            <Alert className={adminMessageType === 'error' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
              <AlertDescription>{adminMessage}</AlertDescription>
            </Alert>
          )}

          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setEditingProduct(null)
              setIsAddingProduct(false)
            }}
          />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Painel Administrativo</h2>
          <Button variant="outline" onClick={handleAdminLogout}>
            Sair
          </Button>
        </div>

        {adminMessage && (
          <Alert className={adminMessageType === 'error' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
            <AlertDescription>{adminMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Produtos Cadastrados
              </CardTitle>
              <CardDescription>
                {products.length} produto(s) cadastrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsAddingProduct(true)}
                className="w-full mb-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">WhatsApp</p>
                <p className="text-xs text-gray-600">{config.whatsappNumber}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">E-mail</p>
                <p className="text-xs text-gray-600">{config.email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">Mensagem Automática</p>
                <p className="text-xs text-gray-600">{config.whatsappMessage}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <ConfigForm />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return isAdminAuthenticated ? renderAdminPanel() : renderAdminLogin()

      case 'inicio':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <Wifi className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">CarConnect</h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Especialistas em Internet Via Satélite
              </p>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Starlink • Acessórios Automotivos • Instalações Profissionais
              </p>
            </div>

            {/* Destaques */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Wifi className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Internet Via Satélite</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Conectividade de alta velocidade em qualquer lugar do Brasil</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Car className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Acessórios Automotivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Equipamentos e acessórios para veículos e motorhomes</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Truck className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Instalação Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Serviço técnico especializado com garantia</p>
                </CardContent>
              </Card>
            </div>

            {/* Produtos em Destaque */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Produtos em Destaque</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 3).map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                      <Button 
                        onClick={() => handleWhatsAppOrder(product.name)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Fazer Pedido
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 'produtos':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Nossos Produtos e Serviços</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Oferecemos uma linha completa de produtos e serviços para conectividade via satélite e acessórios automotivos
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <CardDescription>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    <Button 
                      onClick={() => handleWhatsAppOrder(product.name)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Fazer Pedido
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'sobre':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Sobre a CarConnect</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Especialistas em conectividade via satélite e soluções automotivas
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop" 
                  alt="Equipe CarConnect"
                  className="rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Nossa História</h3>
                <p className="text-gray-600 leading-relaxed">
                  A CarConnect nasceu da paixão por tecnologia e pela liberdade de estar conectado em qualquer lugar. 
                  Somos especialistas em instalação de internet via satélite Starlink e oferecemos uma linha completa 
                  de acessórios automotivos para motorhomes, trailers e veículos de aventura.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Nossa missão é proporcionar conectividade de alta qualidade para quem vive a vida na estrada, 
                  seja para trabalho, lazer ou aventura. Com anos de experiência no mercado, garantimos instalações 
                  profissionais e suporte técnico especializado.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <CardTitle>Qualidade Garantida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Produtos de alta qualidade com garantia e suporte técnico</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>Atendimento Nacional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Atendemos todo o território brasileiro com excelência</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Phone className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Suporte 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Suporte técnico disponível para quando você precisar</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'contato':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Fale Conosco</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Entre em contato conosco e descubra como podemos ajudar você
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Fale diretamente conosco pelo WhatsApp para atendimento rápido e personalizado.
                  </p>
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Chamar no WhatsApp
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    E-mail
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Envie sua dúvida por e-mail e retornaremos em até 24 horas.
                  </p>
                  <Button 
                    onClick={() => window.open(`mailto:${config.email}`)}
                    className="w-full"
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {config.email}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Siga-nos nas Redes Sociais</h3>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => window.open(config.instagram)}
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </Button>
                <Button 
                  onClick={() => window.open(config.facebook)}
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CarConnect</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'inicio', label: 'Início' },
                { id: 'produtos', label: 'Produtos' },
                { id: 'sobre', label: 'Sobre Nós' },
                { id: 'contato', label: 'Fale Conosco' },
                { id: 'admin', label: 'Admin', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'inicio', label: 'Início' },
            { id: 'produtos', label: 'Produtos' },
            { id: 'sobre', label: 'Sobre' },
            { id: 'contato', label: 'Contato' },
            { id: 'admin', label: 'Admin' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">CarConnect</span>
          </div>
          <p className="text-gray-400 mb-4">
            Especialistas em Internet Via Satélite e Acessórios Automotivos
          </p>
          <p className="text-sm text-gray-500">
            © 2024 CarConnect. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}