const MindmapExample = `
    mindmap
    root((mindmap))
        Origins
        Long history
        ::icon(fa fa-book)
        Popularisation
            British popular psychology author Tony Buzan
        Research
        On effectiveness<br/>and features
        On Automatic creation
            Uses
                Creative techniques
                Strategic planning
                Argument mapping
        Tools
        Pen and paper
        Mermaid
`;

const SequenceDiagramExample = `
    sequenceDiagram
        participant web as Web Browser
        participant blog as Blog Service
        participant account as Account Service
        participant mail as Mail Service
        participant db as Storage

        Note over web,db: The user must be logged in to submit blog posts
        web->>+account: Logs in using credentials
        account->>db: Query stored accounts
        db->>account: Respond with query result

        alt Credentials not found
            account->>web: Invalid credentials
        else Credentials found
            account->>-web: Successfully logged in

            Note over web,db: When the user is authenticated, they can now submit new posts
            web->>+blog: Submit new post
            blog->>db: Store post data

            par Notifications
                blog--)mail: Send mail to blog subscribers
                blog--)db: Store in-site notifications
            and Response
                blog-->>-web: Successfully posted
            end
        end
`;

const erDiagramExample = `
    erDiagram
        CAR {
            string registrationNumber
            string make
            string model
        }
        PERSON {
            string firstName
            string lastName
            int age
        }
        PERSON:::foo ||--|| CAR : owns
        PERSON o{--|| HOUSE:::bar : has

        classDef foo stroke:#f00
        classDef bar stroke:#0f0
        classDef foobar stroke:#00f
`;

const timelineExample = `
    timeline
            title MermaidChart 2023 Timeline
            section 2023 Q1 <br> Release Personal Tier
            Bullet 1 : sub-point 1a : sub-point 1b
                : sub-point 1c
            Bullet 2 : sub-point 2a : sub-point 2b
            section 2023 Q2 <br> Release XYZ Tier
            Bullet 3 : sub-point <br> 3a : sub-point 3b
                : sub-point 3c
            Bullet 4 : sub-point 4a : sub-point 4b
`;

const kanbanExample = `
    kanban
  Todo
    [Create Documentation]
    docs[Create Blog about the new diagram]
  [In progress]
    id6[Create renderer so that it works in all cases. We also add som extra text here for testing purposes. And some more just for the extra flare.]
  id9[Ready for deploy]
    id8[Design grammar]@{ assigned: 'knsv' }
  id10[Ready for test]
    id4[Create parsing tests]@{ ticket: MC-2038, assigned: 'K.Sveidqvist', priority: 'High' }
    id66[last item]@{ priority: 'Very Low', assigned: 'knsv' }
  id11[Done]
    id5[define getData]
    id2[Title of diagram is more than 100 chars when user duplicates diagram with 100 char]@{ ticket: MC-2036, priority: 'Very High'}
    id3[Update DB function]@{ ticket: MC-2037, assigned: knsv, priority: 'High' }

  id12[Can't reproduce]
    id3[Weird flickering in Firefox]
`;

const quadrantChartExample = `
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
`;

const packetbetaExample = `
packet-beta
title UDP Packet
0-15: "Source Port"
16-31: "Destination Port"
32-47: "Length"
48-63: "Checksum"
64-95: "Data (variable length)"
`
