import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Users, Calendar, ArrowRight } from 'lucide-react'
import categoriesData from '@/data/categories.json'

export default function HomePage() {
  const stats = [
    { label: 'Registered Artists', value: '500+', icon: Users },
    { label: 'Events Completed', value: '1,200+', icon: Calendar },
    { label: 'Client Rating', value: '4.8/5', icon: Star },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                India's Premier Artist Booking Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Book Talented{' '}
                <span className="text-primary">Performing Artists</span>{' '}
                for Your Events
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with professional singers, dancers, speakers, DJs, and more. 
                Find the perfect entertainment for weddings, corporate events, and celebrations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link href="/artists" passHref>
    <Button size="lg" asChild>
      <>
        <Search className="w-5 h-5 mr-2" />
        Browse Artists
      </>
    </Button>
  </Link>
             
              <Button size="lg" variant="outline" asChild>
                <Link href="/onboard">Join as Artist</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center space-y-2">
                    <Icon className="w-8 h-8 mx-auto text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Artist Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Browse by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover talented artists across various categories for your perfect event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesData.map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link href={`/artists?category=${category.id}`}>
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center text-primary font-medium group-hover:underline">
                      Explore {category.name}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to book the perfect artist for your event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">1. Browse & Filter</h3>
              <p className="text-muted-foreground">
                Search through our curated list of professional artists using filters for category, location, and budget.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">2. Connect & Discuss</h3>
              <p className="text-muted-foreground">
                Contact artists directly, discuss your requirements, and get personalized quotes for your event.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">3. Book & Enjoy</h3>
              <p className="text-muted-foreground">
                Confirm your booking, finalize event details, and enjoy an amazing performance at your event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-primary rounded-2xl px-8 py-16 text-center text-white">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Find Your Perfect Artist?
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of event planners who trust Artistly for their entertainment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
      size="lg"
      variant="outline"
      className="border-white text-primary"
      asChild
    >
                  
                  <Link href="/artists">Start Browsing</Link>
                </Button>
               <Link href="/onboard" passHref>
    <Button
      size="lg"
      variant="outline"
      className="border-white text-primary"
      asChild
    >
      <span>List Your Talent</span>
    </Button>
  </Link>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}