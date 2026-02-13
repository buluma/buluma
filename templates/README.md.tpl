### Just another creative nerd 👋

![GitHub followers](https://img.shields.io/github/followers/buluma)
![GitHub Org's stars](https://img.shields.io/github/stars/buluma)
[![GitHub contributors](https://img.shields.io/github/contributors/buluma/badges.svg)](https://GitHub.com/buluma/badges/graphs/contributors/)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fbuluma.github.io)

I like nerding-out, specifically around [Ansible](https://github.com/ansible/ansible), automated test and infrastucture.

Always willing to learn new things. 

Welcome to my little world.
<img src="https://github.com/buluma/readme-scribe/blob/master/test/trophy.svg" width="100%"/>

#### 👷 Check out what I'm currently working on
{{range recentContributions 5}}
- [{{.Repo.Name}}]({{.Repo.URL}}) - {{.Repo.Description}} ({{humanize .OccurredAt}})
{{- end}}

#### 👨‍💻 Repositories I created recently
{{range recentRepos 5}}
- [{{.Name}}]({{.URL}}){{ with .Description }} - {{.}}{{ end }}
{{- end}}

#### 🚀 Latest releases I've contributed to
{{range recentReleases 5}}
- [{{.Name}}]({{.URL}}) ([{{.LastRelease.TagName}}]({{.LastRelease.URL}}), {{humanize .LastRelease.PublishedAt}}){{ with .Description }} - {{.}}{{ end }}
{{- end}}

#### 🔨 My recent Pull Requests
{{range recentPullRequests 10}}
- [{{.Title}}]({{.URL}}) on [{{.Repo.Name}}]({{.Repo.URL}}) ({{humanize .CreatedAt}})
{{- end}}

#### ⭐ Recent Stars
{{range recentStars 10}}
- [{{.Repo.Name}}]({{.Repo.URL}}) - {{.Repo.Description}} ({{humanize .StarredAt}})
{{- end}}

<!-- ## I Am
![Metrics](/github-metrics.svg)
# working version of metric
<a href="https://metrics.lecoq.io/about/buluma" target="_blank"><img src="/github-metrics.svg" alt="Metrics" width="100%"></a> -->

## Contribution graph
<img alt="github-snake" src="https://github.com/buluma/readme-scribe/blob/png/github-contribution-grid-snake.svg" width="100%"/>
