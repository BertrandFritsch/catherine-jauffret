function Invoke-CJCContentful {
  [cmdletbinding()]
  param (
    [Parameter(ParameterSetName = "UploadAsset", Mandatory = $False)]
    [ValidateNotNullOrEmpty()]
    [string] $Space = '67d5nyiiiczn',

    [ValidateNotNullOrEmpty()]
    [string] $Environment = 'master',

    [Parameter(ParameterSetName = "UploadAsset", Mandatory = $True, ValueFromPipeline = $true)]
    [ValidateNotNull()]
    [Collections.Hashtable] $Collage,

    [Parameter(ParameterSetName = "UploadAsset", Mandatory = $True)]
    [switch] $UploadAsset
  )

  begin {
    $spaceId = '67d5nyiiiczn'
    $environment = 'master'
    $contentType = 'collage'
    $creds = Get-StoredCredential -Name ContentfulScriptAPIToken -StorePath $HOME\.creds
    $locale = 'fr-FR'
  }

  process {
    switch ($PSCmdlet.ParameterSetName) {
      'UploadAsset' {
        $file = $Collage.File
        if (-not $file) {
          throw "No file has been provided!"
        }

        $name = $Collage.Name
        if (-not $name) {
          $name = $file.BaseName -replace '\(.+\)' -replace '\s{2+}', ' ' -replace '^\s+' -replace '--.*$' -replace '(\s|_|\.)*$'
        }

        $slug = ConvertTo-SlugUri $name

        Write-Verbose "Use the name '$name'"
                
        Write-Verbose "Check the unicity of the '$slug' slug"
        $entry = Invoke-RestMethod -Authentication Bearer `
                                   -Token $creds.Password `
                                   -Uri "https://api.contentful.com/spaces/$spaceId/environments/$environment/entries?content_type=$contentType&fields.slug.$($locale)=$slug" `
                                   -Headers @{ 'X-Contentful-Content-Type' = $contentType } `
                                   -ErrorAction Stop | Where-Object total -GT 0

        if ($entry) {
          throw "A slug for the collage '$file' does already exist!"
        }

        Write-Host "Add collage '$name'"

        Write-Verbose "Uploading the '$file' file..."
        $upload = Invoke-RestMethod -Authentication Bearer `
                                    -Token $creds.Password `
                                    -Method Post `
                                    -Uri https://upload.contentful.com/spaces/$spaceId/uploads `
                                    -ContentType 'application/octet-stream' `
                                    -InFile $file `
                                    -ErrorAction Stop

        $mimeType = $Collage.MimeType
        if (-not $mimeType) {
          $mimeType = Get-FileMimeType $file.FullName -ErrorAction Stop
        }

        $date = $Collage.Date
        if ($null -eq $date) {
          throw "Please provide the date of the collage!"
        }

        Write-Verbose "Use the '$mimeType' mime type"

        $jsonName = $name -replace '"','\"'

        Write-Verbose "Create the '$name' asset"

        $body = @"
        {
          "fields": {
              "title": {
                  "$locale": "$jsonName"
              },
              "file": {
                  "$locale": {
                      "contentType": "$mimeType",
                      "fileName": "$jsonName$($file.Extension)",
                      "uploadFrom": {
                          "sys": {
                            "type": "Link",
                            "linkType": "Upload",
                            "id": "$($upload.sys.id)"
                          }
                      }
                  }
              }
          }
        }
"@

        $asset = Invoke-RestMethod -Authentication Bearer `
                                   -Token $creds.Password `
                                   -Method Post `
                                   -Uri https://api.contentful.com/spaces/$spaceId/environments/$environment/assets `
                                   -ContentType 'application/vnd.contentful.management.v1+json; charset=utf-8' `
                                   -Body $body `
                                   -ErrorAction Stop
                                  
        Write-Verbose "Process the '$name' asset"
        Invoke-RestMethod -Authentication Bearer `
                          -Token $creds.Password `
                          -Method Put `
                          -Uri https://api.contentful.com/spaces/$spaceId/environments/$environment/assets/$($asset.sys.id)/files/$locale/process `
                          -Headers @{ 'X-Contentful-Version' = $asset.sys.version } `
                          -ErrorAction Stop | Out-Null

        while ($asset.sys.version -ne 2) {
          Write-Verbose "Sleep 2s to let the file the time being processed..."
          Start-Sleep -Seconds 2
                                    
          Write-Verbose "Retrieve the version of the '$name' asset"
          $asset = Invoke-RestMethod -Authentication Bearer `
                                     -Token $creds.Password `
                                     -Uri https://api.contentful.com/spaces/$spaceId/environments/$environment/assets/$($asset.sys.id) `
                                     -ErrorAction Stop
        }                  
                                                    
        Write-Verbose "Publish the '$name' asset"
        $asset = Invoke-RestMethod -Authentication Bearer `
                                   -Token $creds.Password `
                                   -Method Put `
                                   -Uri https://api.contentful.com/spaces/$spaceId/environments/$environment/assets/$($asset.sys.id)/published `
                                   -Headers @{ 'X-Contentful-Version' = $asset.sys.version } `
                                   -ErrorAction Stop

        Write-Verbose "Create the '$name' collage"
        
        $body = @"
        {
          "fields": {
            "title": {
              "$locale": "$jsonName"
            },
            "slug": {
              "$locale": "$slug"
            },
            "collage": {
              "$locale": {
                "sys": {
                  "type": "Link",
                  "linkType": "Asset",
                  "id": "$($asset.sys.id)"
                }
              }
            },
            "date": {
              "$locale": "$($Date.ToString('yyyy-MM-dd'))"
            }
          }
        }
"@

        $entry = Invoke-RestMethod -Authentication Bearer `
                                   -Token $creds.Password `
                                   -Method Post `
                                   -Uri https://api.contentful.com/spaces/$spaceId/environments/$environment/entries `
                                   -ContentType 'application/vnd.contentful.management.v1+json; charset=utf-8' `
                                   -Headers @{ 'X-Contentful-Content-Type' = $contentType } `
                                   -Body $body `
                                   -ErrorAction Stop

                                                    
        Write-Verbose "Publish the '$name' collage"
        Invoke-RestMethod -Authentication Bearer `
                          -Token $creds.Password `
                          -Method Put `
                          -Uri https://api.contentful.com/spaces/$spaceId/environments/$environment/entries/$($entry.sys.id)/published `
                          -Headers @{ 'X-Contentful-Version' = $entry.sys.version } `
                          -ErrorAction Stop | Out-Null
      }
    }
  }
}
