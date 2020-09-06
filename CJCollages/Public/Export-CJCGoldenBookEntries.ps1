function Export-CJCGoldenBookEntries {
  [cmdletbinding()]
  param (
    [Parameter(Mandatory = $True, ValueFromPipeline = $true)]
    [ValidateNotNull()]
    [string] $Content
  )

  begin {
    $regExpOptions = [Text.RegularExpressions.RegexOptions]::ExplicitCapture -bor [Text.RegularExpressions.RegexOptions]::Singleline
    $Culture = Get-Culture 'fr-FR'

    $spaceId = '67d5nyiiiczn'
    $environment = 'master'
    $contentType = 'golden-book'
    $locale = 'fr-FR'
  }

  process {
    [Text.RegularExpressions.RegEx ]::Matches($Content, '<li class="comment.+?<cite.+?>(?<name>.+?)</cite>.+?<div class="comment-meta commentmetadata"><a.+?>\s*(?<time>.+?)<.+?</div>(?<comment>.+?)</div>.*?</li>', $regExpOptions) `
      | ForEach-Object {
          $websiteMatch = [Text.RegularExpressions.RegEx ]::Match($_.Groups['name'].Value, '<a href="https://web.archive.org/web/20190610223044/(?<url>.+?)".+?>(?<name>.+?)</a>')
          [PSCustomObject] @{
            Name = $websiteMatch.Success ? $websiteMatch.Groups['name'].Value : $_.Groups['name'].Value
            WebSite = $websiteMatch.Success ? $websiteMatch.Groups['url'].Value : $null
            Date = [datetime]::ParseExact($_.Groups['time'].Value, "d MMMM yyyy à H 'h' m 'min'", $Culture)
            Comment = [Web.HttpUtility]::HtmlDecode(($_.Groups['comment'].Value -replace '\n|\t' -replace '\<br/\>',"`n" -replace '\<p\>' -replace '\</p\>', "`n"))
          }
        } `
        | ForEach-Object {
          @"
            {
              "sys": {
                "space": {
                  "sys": {
                    "type": "Link",
                    "linkType": "Space",
                    "id": "$spaceId"
                  }
                },
                "id": "$((New-Guid).Guid -replace '-')",
                "type": "Entry",
                "createdAt": "$((Get-Date).ToUniversalTime().ToString('o'))",
                "updatedAt": "$((Get-Date).ToUniversalTime().ToString('o'))",
                "environment": {
                  "sys": {
                    "id": "$environment",
                    "type": "Link",
                    "linkType": "Environment"
                  }
                },
                "publishedVersion": 1,
                "publishedAt": "$((Get-Date).ToUniversalTime().ToString('o'))",
                "firstPublishedAt": "$((Get-Date).ToUniversalTime().ToString('o'))",
                "createdBy": {
                  "sys": {
                    "type": "Link",
                    "linkType": "User",
                    "id": "3IBx0f7554FgzqjfQNgrVH"
                  }
                },
                "updatedBy": {
                  "sys": {
                    "type": "Link",
                    "linkType": "User",
                    "id": "3IBx0f7554FgzqjfQNgrVH"
                  }
                },
                "publishedCounter": 1,
                "version": 1,
                "publishedBy": {
                  "sys": {
                    "type": "Link",
                    "linkType": "User",
                    "id": "3IBx0f7554FgzqjfQNgrVH"
                  }
                },
                "contentType": {
                  "sys": {
                    "type": "Link",
                    "linkType": "ContentType",
                    "id": "$contentType"
                  }
                }
              },
              "fields": {
                "name": {
                  "$locale": "$($_.Name)"
                },
                "date": {
                  "$locale": "$($_.Date.ToUniversalTime().ToString('o'))"
                },
                "email": {
                  "$locale": "unknown@gmail.com"
                },
                "website": {
                  "$locale": $($_.WebSite ? '"' + $_.WebSite + '"' : 'null')
                },
                "comment": {
                  "$locale": {
                    "nodeType": "document",
                    "data": {
                    },
                    "content": [
                      {
                        "nodeType": "paragraph",
                        "content": [
                          {
                            "nodeType": "text",
                            "value": "$($_.Comment -replace "`n", '\n')",
                            "marks": [
                            ],
                            "data": {
                            }
                          }
                        ],
                        "data": {
                        }
                      }
                    ]
                  }
                }
              }
            }
"@            | ConvertFrom-Json
          }
  }
}
