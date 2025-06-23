import { Artist } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Languages, IndianRupee } from 'lucide-react';
import { truncateText, formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface ArtistCardProps {
  artist: Artist;
  onQuoteRequest?: (artistId: string) => void;
}

export default function ArtistCard({ artist, onQuoteRequest }: ArtistCardProps) {
  const handleQuoteRequest = () => {
    if (onQuoteRequest) {
      onQuoteRequest(artist.id);
    } else {
      console.log(`Quote requested for ${artist.name}`);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg overflow-hidden">
          {artist.profileImage ? (
            <Image
              src={artist.profileImage}
              alt={`${artist.name} profile`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200"
              aria-label={`Placeholder avatar for ${artist.name}`}
              role="img"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">
                {artist.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3">
            <Badge 
              variant={artist.availability ? "default" : "secondary"}
              className={`${
                artist.availability 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white`}
            >
              {artist.availability ? 'Available' : 'Busy'}
            </Badge>
          </div>

          {(artist.rating !== undefined && artist.rating !== null) && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/70 text-white hover:bg-black/80">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {artist.rating}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
              {artist.name}
            </h3>
            {artist.experience && (
              <p className="text-sm text-gray-500">{artist.experience} experience</p>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {truncateText(artist.bio, 100)}
          </p>

          <div className="flex flex-wrap gap-1">
            {artist.category?.slice(0, 3).map(cat => (
              <Badge 
                key={cat} 
                variant="outline" 
                className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                {cat}
              </Badge>
            ))}
            {artist.category && artist.category.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{artist.category.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{artist.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Languages className="w-4 h-4 mr-1" />
            <span>{artist.languages?.slice(0, 2).join(', ')}</span>
            {artist.languages && artist.languages.length > 2 && (
              <span className="ml-1">+{artist.languages.length - 2} more</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-center gap-1">
  <div className="flex items-center justify-center text-lg font-semibold text-gray-900">
    {/* Single Rupee symbol */}
    <IndianRupee className="w-5 h-5 mr-1 flex-shrink-0" />
    <span className="leading-tight">{formatPrice(artist.feeRange)}</span>
  </div>

  <Button
    onClick={handleQuoteRequest}
    className="bg-purple-600 hover:bg-purple-700 text-white px-6"
    size="sm"
  >
    Ask for Quote
  </Button>
</CardFooter>



        
       
    </Card>
  );
}

