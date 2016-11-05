# Short URL generator for posts.
#
# Generates shortened URL pages based on the SHA1 hash of the post date.
#
# Example post configuration:
#
#    ---
#     layout:  post
#     title:   "URL Shortener for Jekyll."
#     date:    1970-01-01 00:00:00           # The timestamp is converted to Unix time.
#     shorten: true                          # Shorten this post.
#    ---
#
# Exmaple _config.yml configuration:
#
#    shortener:
#       basepath: /s/        # Path for stored redirects.
#       preserve: false      # Keep previously generated files.
#       salt:     "LouisT"   # The optional salt, used when hasing the Unix time.
#
# Author: Louis T.
# Site: https://lou.ist/
# Plugin Source: http://github.com/LouisT/jekyll-url-shortener
# Plugin License: MIT
require 'digest/sha1'

module Jekyll
  class ShortenedFile < StaticFile
    def write (dest)
      super(dest) rescue ArgumentError
      true
    end
  end
  class URLShortener < Generator
    safe true
    priority :low
    def generate (site)
        @site = site

        baseurl = site.config['baseurl'] ? site.config['baseurl'] : ''
        weburl = site.config['url'] ? site.config['url'] : ''
        shortpath = site.config['shortener']['shortpath'] ? site.config['shortener']['shortpath'] : '/s/'
        salt = site.config['shortener']['salt'] ? site.config['shortener']['salt'] : ''
        @site.posts.docs.each do |post|
          if post.data['shorten'] and post.data['date']
             hash = Digest::SHA1.new.hexdigest(post.data['date'].to_i.to_s + salt.to_s)[0...10]
             path = File.join(baseurl, shortpath, hash)
             dest = File.join(site.dest, path)
             file = File.join(dest, 'index.html')
             post.data['short'] = {
               "url" => weburl+path,
               "hash" => hash
             }
             unless File.directory?(dest)
                FileUtils.mkdir_p(dest)
              else
                if site.config['shortener']['preserve']
                   return site.static_files << ShortenedFile.new(site, dest, '/', file)
                end
             end
             File.open(file, 'w') do |file|
               file.write(template(post.url, post.data['title']).gsub(/\n\s+/, " ").strip)
               file.close
             end
             site.static_files << ShortenedFile.new(site, dest, '/', file)
          end
        end
    end
    def template (redirect, title)
        <<-EOF
        <!DOCTYPE html>
        <html>
         <head>
          <title>#{title}</title>
          <link rel="canonical" href="#{redirect}"/>
          <meta http-equiv="content-type" content="text/html; charset=utf-8" />
          <meta http-equiv="refresh" content="0; url = #{redirect}" />
         </head>
         <body>
          <h3><a href="#{redirect}">#{redirect}</a></h3>
          <script>window.location = "#{redirect}"</script>
         </body>
        </html>
        EOF
    end
  end
end
